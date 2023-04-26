app.tsx first imports the modules we need to build a React app with Docker Desktop's extension API client.

it uses React and useState from the react module to build functional components that manage state.

we also import Button component from the @mui/material module, To use to build the ui through react.

and finally we import createDockerDesktopClient function from the @docker/extension-api-client module, which is a client API for communicating with the Docker Desktop's backend. The useDockerDesktopClient function creates a Docker Desktop client for use within the app.

The App function is exported and returns JSX, which is rendered by React to create a UI. The UI consists of a title and description, two input fields for entering commands(where we take in the terminal command(ls, cd, hzn) and the other for flags(-h,--help), and a button for triggering requests to the backend. The response from the backend is displayed in a disabled text field below the button.

When the buttonClicked function is called, it first makes a request to the arch client arch machine using the kubectl command. This is done using the exec method of the Docker Desktop client and a JSON object containing the output is created.

Then, it makes another request to the arch iso using the inputText and inputText2 values entered into the input fields. The response is also wrapped in a JSON object and set to the response state variable.

Finally, the App function returns the UI with the response displayed in the text field. Note that the client variable created at the beginning relies on Docker Desktop's presence as a host application, and running the React app in a browser may not work properly.

As stated before this unfortunately didnt work as expected and only ran the command on a clean arch temporary machine in the background so it isnt able to reach the host machine
