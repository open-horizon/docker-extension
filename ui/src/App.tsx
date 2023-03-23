import React from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, TextField, Typography } from '@mui/material';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
} 

export function App() {
  const [response, setResponse] = React.useState<string>();
  const ddClient = useDockerDesktopClient();

  const fetchAndDisplayResponse = async () => {
    const result2 = await ddClient.extension.vm?.cli?.exec("mkdir", [" /mnt/c/Users/yasir/Desktop/done"], {
      stream: {
        onOutput(data): void {
          console.log("start 1" + JSON.stringify(data));
            // As we can receive both `stdout` and `stderr`, we wrap them in a JSON object
            JSON.stringify(
              {
                stdout: data.stdout,
                stderr: data.stderr,
              },
              null,
              "  "
            );
        }
      }
    });
    
    console.log("    finish 1  " + JSON.stringify(result2) );
    console.log("   start 2   " );
    const result = await ddClient.extension.vm?.service?.get('/hello');
    console.log("    finish 2  " + JSON.stringify(result) );
    // const result = await ddClient.extension.host.cli.exec("kubectl", ["-h"]);
    setResponse(JSON.stringify(result));
  };

  return (
    <>
      <Typography variant="h3">Docker extension demo</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        The basic page for a terminal in which you can write down a command
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Pressing the below button will trigger a request to the backend. Its
        response will appear in the textarea.
      </Typography>
      <Stack direction="row" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" onClick={fetchAndDisplayResponse}>
          Fetch response
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
    </>
  );
}
