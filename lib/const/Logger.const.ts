// Logger.js
import winston from 'winston';
import { $LOG_LEVEL } from '../env';

// Create a Winston logger instance with desired configurations
const logger = winston.createLogger({
  level: $LOG_LEVEL,
  format: winston.format.combine(
    winston.format.colorize(), // Colorize the output
    winston.format.simple()    // Simplify the output
  ),
  transports: [
    new winston.transports.Console() // Log to the console
    // You can add more transports here (e.g., File, HTTP)
  ]
});

// Export the logger instance so you can use Logger.info, Logger.error, etc.
const Logger = logger;

export default Logger;