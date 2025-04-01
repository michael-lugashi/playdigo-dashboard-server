import winston from 'winston';

// Custom log format to make logs more readable with shortened stack traces
const customLogFormat = winston.format.printf((info) =>
  Object.entries(info).reduce(
    (acc, [key, val]) => {
      if (['level', 'message', 'timestamp'].includes(key)) {
        return acc;
      }

      if (key === 'stack' && typeof val === 'string') {
        return acc + `  ${key}: ${val.split('\n').slice(0, 3).join('\n')}\n`;
      }

      if (key === 'originalError' && typeof val === 'object') {
        return acc + `  originalError: ${JSON.stringify(val)}\n`;
      }

      return acc + `  ${key}: ${String(val)}\n`;
    },
    `${String(info.timestamp)} [${info.level}]: ${String(info.message)}\n`
  )
);

// Create a simple console logger
export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.colorize(),
    customLogFormat
  ),
  level: 'info',
  transports: [new winston.transports.Console()]
});
