/*
	Filename: config.js
	Description:
 */
//------------------------------------------------------------------------------
require('dotenv').config();
const appRoot 								= require('app-root-path');
const winston 								= require('winston');
const fs 									= require('fs');
const path            						= require('path');
const chalk 								= require('chalk');
const LOG_DIR 								= appRoot+'/logs';
const ERROR_LOG_FILE						= LOG_DIR+'/'+'error.json';
const COMBINE_LOG_FILE						= LOG_DIR+'/'+'combine.json';
const DB_LOG_FILE 							= LOG_DIR+'/'+'db.json';
const SOCKET_LOG_FILE 						= LOG_DIR+'/'+'sockets.json';
const REQUEST_LOG_FILE 						= LOG_DIR+'/'+'request.json';
const TIMESTAMP_PATTERN						= 'DD-MM-YYYY HH:mm:ss';
let CONFIG 									= {};
//------------------------------------------------------------------------------
//	Create logs folder if does not exists
//------------------------------------------------------------------------------
if(!fs.existsSync(LOG_DIR))
{
	fs.mkdirSync(LOG_DIR);
}
//------------------------------------------------------------------------------
//	Add parameters to global CONFIG
//------------------------------------------------------------------------------
CONFIG.app 				= process.env.APP 				|| 	'dev';
CONFIG.port_unsecured 	= process.env.PORT_UNSECURED 	|| 	'8000';
CONFIG.port 			= process.env.PORT 				|| 	'8443';
CONFIG.db_dialect 		= process.env.DB_DIALECT 		|| 	'mongodb';
CONFIG.db_host 			= process.env.DB_HOST 			|| 	'localhost';
CONFIG.db_port 			= process.env.DB_PORT 			|| 	'27017';
CONFIG.db_url 			= process.env.DB_URL 			||	'mongodb://34.199.158.57:27017';
CONFIG.db_name 			= process.env.DB_NAME 			|| 	'Alexa';
CONFIG.db_name_acc 		= process.env.DB_NAME_ACC 		|| 	'amazon_accounts';
CONFIG.env 				= process.env.ENV				|| 	'dev';

switch(process.env.SIP_SERVER)
{
	case 'SV9500':
		if(process.env.OAI_IP_SV9500 && process.env.OAI_PORT_SV9500)
		{
			CONFIG.oai_ip 			= process.env.OAI_IP_SV9500 			|| 	'10.0.97.243';
			CONFIG.oai_port 		= process.env.OAI_PORT_SV9500 			|| 	'60030';
			CONFIG.sip_server 		= process.env.SIP_SERVER				||	'SV9500'
		}
		else
		{
			console.log(chalk.bold.red('ENV params not set'));
			process.exit(1);
		}
		
	break;
	case 'SV9100':
		if(process.env.OAI_IP_SV9100 && process.env.OAI_PORT_SV9100)
		{
			CONFIG.oai_ip 			= process.env.OAI_IP_SV9100 			|| 	'10.0.97.243';
			CONFIG.oai_port 		= process.env.OAI_PORT_SV9100 			|| 	'60030';	
			CONFIG.sip_server 		= process.env.SIP_SERVER				||	'SV9100'
		}
		else
		{
			console.log(chalk.bold.red('ENV params not set'));
			process.exit(1);	
		}
	break;
	default:
		console.log(chalk.bold.red('SIP Server env param error'));
		process.exit(1);
	break;
}
//------------------------------------------------------------------------------
// Create logger for logging with two file transports
//------------------------------------------------------------------------------
CONFIG.logger = winston.createLogger({
					format: winston.format.combine(
						winston.format.splat(),
						winston.format.timestamp({format: TIMESTAMP_PATTERN}),
					),
					transports:[
						new winston.transports.File({
							format: winston.format.combine(
								winston.format.json(),
								winston.format.prettyPrint(),
								winston.format.printf(
									info => `${info.timestamp} ${info.level} : ${info.message}`,
									debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
									error => `${error.timestamp} ${error.level} : ${error.message}`
								)
							),
							filename: COMBINE_LOG_FILE,
							level: 'silly'
						}),
						new winston.transports.Console({
							level: CONFIG.env === 'dev' ? 'debug' : 'info',
							format: winston.format.combine(
								winston.format.colorize(),
								winston.format.printf(
									info => `${info.timestamp} ${info.level} : ${info.message}`,
									debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
									error => `${error.timestamp} ${error.level} : ${error.message}`
								)
							)
						})
					]
				});

CONFIG.errlogger = winston.createLogger({
						format: winston.format.combine(
							winston.format.splat(),
							winston.format.timestamp({format: TIMESTAMP_PATTERN})
						),
						transports:[
							new winston.transports.File({
								format: winston.format.combine(
									winston.format.json(),
									winston.format.prettyPrint(),
									winston.format.printf(
										error => `${error.timestamp} ${error.level} : ${error.message}`
									)
								),
								filename: ERROR_LOG_FILE,
								level: 'error'
							}),
							new winston.transports.Console({
								level: CONFIG.env === 'dev' ? 'debug' : 'info',
								format: winston.format.combine(
									winston.format.colorize(),
									winston.format.printf(
										info => `${info.timestamp} ${info.level} : ${info.message}`,
										debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
										error => `${error.timestamp} ${error.level} : ${error.message}`
									)
								)
							})
						]
					});

CONFIG.socklogger = winston.createLogger({
						format: winston.format.combine(
							winston.format.splat(),
							winston.format.timestamp({format: TIMESTAMP_PATTERN})
						),
						transports:[
							new winston.transports.File({
								format: winston.format.combine(
									winston.format.json(),
									winston.format.prettyPrint(),
									winston.format.printf(
										info => `${info.timestamp} ${info.level} : ${info.message}`,
										debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
										error => `${error.timestamp} ${error.level} : ${error.message}`
									)
								),
								filename: COMBINE_LOG_FILE,
								level: 'silly'
							}),
							new winston.transports.File({
								format: winston.format.combine(
									winston.format.json(),
									winston.format.prettyPrint(),
									winston.format.printf(
										info => `${info.timestamp} ${info.level} : ${info.message}`,
										debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
										error => `${error.timestamp} ${error.level} : ${error.message}`
									)
								),
								filename: SOCKET_LOG_FILE,
								level: 'silly'
							}),
							new winston.transports.Console({
								level: CONFIG.env === 'dev' ? 'debug' : 'info',
								format: winston.format.combine(
									winston.format.colorize(),
									winston.format.printf(
										info => `${info.timestamp} ${info.level} : ${info.message}`,
										debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
										error => `${error.timestamp} ${error.level} : ${error.message}`
									)
								)
							})
						]
					});

CONFIG.reqlogger = winston.createLogger({
						format: winston.format.combine(
							winston.format.splat(),
							winston.format.timestamp({format: TIMESTAMP_PATTERN})
						),
						transports:[
							new winston.transports.File({
								format: winston.format.combine(
									winston.format.json(),
									winston.format.prettyPrint(),
									winston.format.printf(
										info => `${info.timestamp} ${info.level} : ${info.message}`,
										debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
										error => `${error.timestamp} ${error.level} : ${error.message}`
									)
								),
								filename: COMBINE_LOG_FILE,
								level: 'silly'
							}),
							new winston.transports.File({
								format: winston.format.combine(
									winston.format.json(),
									winston.format.prettyPrint(),
									winston.format.printf(
										info => `${info.timestamp} ${info.level} : ${info.message}`,
										debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
										error => `${error.timestamp} ${error.level} : ${error.message}`
									)
								),
								filename: REQUEST_LOG_FILE,
								level: 'silly'
							}),
							new winston.transports.Console({
								level: CONFIG.env === 'dev' ? 'debug' : 'info',
								format: winston.format.combine(
									winston.format.colorize(),
									winston.format.printf(
										info => `${info.timestamp} ${info.level} : ${info.message}`,
										debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
										error => `${error.timestamp} ${error.level} : ${error.message}`
									)
								)
							})
						]
					});

CONFIG.dblogger = winston.createLogger({
						format: winston.format.combine(
							winston.format.splat(),
							winston.format.timestamp({format: TIMESTAMP_PATTERN})
						),
						transports:[
							new winston.transports.File({
								format: winston.format.combine(
									winston.format.json(),
									winston.format.prettyPrint(),
									winston.format.printf(
										info => `${info.timestamp} ${info.level} : ${info.message}`,
										debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
										error => `${error.timestamp} ${error.level} : ${error.message}`)
								),
								filename: COMBINE_LOG_FILE,
								level: 'silly'
							}),
							new winston.transports.File({
								format: winston.format.combine(
									winston.format.json(),
									winston.format.prettyPrint(),
									winston.format.printf(
										info => `${info.timestamp} ${info.level} : ${info.message}`,
										debug => `${debug.timestamp} ${debug.level} : ${debug.message}`,
										error => `${error.timestamp} ${error.level} : ${error.message}`
									)
								),
								filename: DB_LOG_FILE,
								level: 'silly'
							})
						]
					});
//------------------------------------------------------------------------------
module.exports = CONFIG;
