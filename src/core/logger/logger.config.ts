import winston from 'winston';

// Create a simple console logger
export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.colorize(),
    winston.format.printf((info) => {
      const { level, message, timestamp, ...rest } = info;
      const extraInfo = Object.keys(rest).length ? JSON.stringify(rest) : '';
      return `${String(timestamp)} [${String(level)}]: ${String(message)} ${extraInfo}`;
    })
  ),
  level: 'info',
  transports: [new winston.transports.Console()]
});
