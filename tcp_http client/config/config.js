//------------------------------------------------------------------------------
require('dotenv').config();
var appRoot 		= require('app-root-path');
const winston 		= require('winston');
let CONFIG 			= {};
//------------------------------------------------------------------------------
//	Add parameters to the global CONFIG
//------------------------------------------------------------------------------
CONFIG.app 					= process.env.APP 					|| 'dev';
CONFIG.tcp_server_port 		= process.env.TCP_SERVER_PORT 		|| '9001';
CONFIG.tcp_server_host 		= process.env.TCP_SERVER_HOST 		|| 'ec2-3-80-153-122.compute-1.amazonaws.com';
CONFIG.client_service_url 	= process.env.CLIENT_SERVICE_URL 	|| 'https://127.0.0.1:8443';
CONFIG.env 					= process.env.ENV					|| 'dev';
//------------------------------------------------------------------------------
// Create logger for logging
// -----------------------------------------------------------------------------
const logger = winston.createLogger({
		transports:[
		new winston.transports.File({
										format: winston.format.combine(
												winston.format.label({
														label: CONFIG.env
													}),												
												winston.format.timestamp({
													format: 'HH:mm:ss DD-YYYY-MM'
												}),
												winston.format.splat(),
												winston.format.json(),
												winston.format.prettyPrint(),
												winston.format.printf(error => `${error.timestamp} ${error.level}: ${error.message}`)
											),
										filename: appRoot+'/logs/error.log', 
										level: 'error'
									}),
		new winston.transports.File({
										format: winston.format.combine(
												winston.format.label({
														label: CONFIG.env
													}),
												winston.format.timestamp({
													format: 'HH:mm:ss DD-YYYY-MM'
												}),
												winston.format.splat(),
												winston.format.json(),
												winston.format.prettyPrint(),
												winston.format.printf(
													info => `${info.timestamp} ${info.level}: ${info.message}`,
													debug => `${debug.timestamp} ${debug.level}: ${debug.message}`,
													error => `${error.timestamp} ${error.level}: ${error.message}`)
											),										
										filename: appRoot+'/logs/combined.log',
										level: 'silly'
									})
	]
});

// If application is running in dvelopemnt environment then show logs to console
// else do not show logs on console
if(process.env.ENV === 'prod'){
	logger.add(new winston.transports.Console({
		format: winston.format.combine(
				winston.format.colorize(),
				winston.format.splat(),
				winston.format.simple()
			),
		level: 'info'
	}));
}

if(process.env.ENV === 'dev'){
	logger.add(new winston.transports.Console({
		format: winston.format.combine(
				winston.format.colorize(),
				winston.format.splat(),
				winston.format.simple()
			),
		level: 'silly'
	}));
}
//------------------------------------------------------------------------------
// Add the logger instance to the global CONFIG
//------------------------------------------------------------------------------
CONFIG.logger = logger;
//------------------------------------------------------------------------------
module.exports = CONFIG;