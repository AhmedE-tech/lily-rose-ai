// CodeSandbox requires this file
import { spawn } from 'child_process';

// Start Python server
const pythonProcess = spawn('python', ['main.py'], {
  stdio: 'inherit',
  shell: true
});

pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);
});
