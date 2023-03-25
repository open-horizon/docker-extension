package main

import (
	"flag"
	"github.com/labstack/echo/middleware"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"

	"github.com/labstack/echo"
	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

func main() {
	// link to external socket

	var socketPath string
	flag.StringVar(&socketPath, "socket", "/run/guest-services/backend.sock", "Unix domain socket to listen on")
	flag.Parse()

	_ = os.RemoveAll(socketPath)

	logger.SetOutput(os.Stdout)

	logMiddleware := middleware.LoggerWithConfig(middleware.LoggerConfig{
		Skipper: middleware.DefaultSkipper,
		Format: `{"time":"${time_rfc3339_nano}","id":"${id}",` +
			`"method":"${method}","uri":"${uri}",` +
			`"status":${status},"error":"${error}"` +
			`}` + "\n",
		CustomTimeFormat: "2006-01-02 15:04:05.00000",
		Output:           logger.Writer(),
	})

	logger.Infof("Starting listening on %s\n", socketPath)
	router := echo.New()
	router.HideBanner = true
	router.Use(logMiddleware)
	startURL := ""

	ln, err := listen(socketPath)
	if err != nil {
		logger.Fatal(err)
	}
	router.Listener = ln

	// run command
	_, o := hzn("ls")

	router.GET("/hello", o) // send help

	logger.Fatal(router.Start(startURL))
	// hzn(command) // ping oneself
}

func listen(path string) (net.Listener, error) {
	return net.Listen("unix", path)
}

type HTTPMessageBody struct{ Message string }

func hzn(cmd string) (error, string) {
	out, err := exec.Command(cmd).Output()

	if err != nil {
		log.Fatal(err)
	}
	return err, string(out)
}
