import React, {useRef, useState} from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography } from '@mui/material';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() { return client;}

export function Hzn() {
    const inputRef = useRef(null);
    const hisRef = useRef(null)
    const [text, disp] = useState("");
    const pipeCommand: (e: any)=>void = (e) => {
        // grab command
        const cmd = e.target.cmdd.value
        alert(cmd)

        // send to backend function

        // display command on screen
        //inputRef.current ? inputRef.current.value : "" ;

        // display the output
        disp(cmd)
    }
    return (
        <>
            <Stack direction="column">
            <TextField
                //ref = {hisRef}
                type="text"
                sx={{width: 480}}
                disabled
                multiline
                variant="outlined"
                minRows={5}
                value={text}
            />
            <Stack direction="row">
            <TextField
                id="cmdd"
                type="text"
                ref = {inputRef}
                sx={{width: 450}}
                label="hzn command here"
                onKeyUp={event => {
                    event.preventDefault()
                    if (event.key === "Enter") pipeCommand(event)

                }}
            />
            <Button onClick={pipeCommand}/>
            </Stack>
            </Stack>
        </>
    );
}

export function App() {
  const [response, setResponse] = React.useState<string>();
  const ddClient = useDockerDesktopClient();

  const fetchAndDisplayResponse = async () => {
    const result = await ddClient.extension.vm?.service?.get('/hello');
    setResponse(JSON.stringify(result));
  };

  return (
    <>
      <Typography variant="h3">Docker extension demo</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This is a basic page rendered with MUI, using Docker's theme. Read the
        MUI documentation to learn more. Using MUI in a conventional way and
        avoiding custom styling will help make sure your extension continues to
        look great as Docker's theme evolves.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Pressing the below button will trigger a request to the backend. Its
        response will appear in the textarea.
      </Typography>
      <Stack direction="row" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" onClick={fetchAndDisplayResponse}>
          Call backend
        </Button>

        <TextField
          label="Backend response"
          sx={{ width: 480 }}
          disabled
          multiline
          variant="outlined"
          minRows={5}
          value={response ?? ''}
        />
      </Stack>
      <Hzn />
    </>
  );
}
