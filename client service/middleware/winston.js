var appRoot = require('app-root-path');
var winston = require('winston');

var options = {
  file: {
    level: 'debug',
    filename: '../logs/logs.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
};

var logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function(message,encoding){
        logger.info(message);
    }
};

module.exports = logger;
