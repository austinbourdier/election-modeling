import {spawn} from 'child_process';

export = () => {
  var command = [
    'exec', 'pact-mock-service', 'restart','-p', '1234', '--pact-specification-version',
    '2.0.0', '-l', 'tmp/pact.logs', '--pact-dir', 'pacts'
   ];
  const pact = spawn('bundle', command);
  pact.stdout.on('data', (data: string) => {
    console.log(`stdout: ${data}`);
  });
  pact.stderr.on('data', (data: string) => {
    console.log(`stderr: ${data}`);
  });
  pact.on('close', (code: number) => {
    console.log(`Pact server stopped`);
  });
};
