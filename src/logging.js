import bunyan from 'bunyan';

export default function getLogger(name) {
  const log = bunyan.createLogger({
    name,
    streams: [
      {
        stream: process.stderr,
        level: 'error',
        name: 'error'
      },
      {
        stream: process.stdout,
        level: 'warn',
        name: 'console'
      }
    ]
  });
  return log;
}
