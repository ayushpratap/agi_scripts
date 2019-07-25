/*
    Filename    : server.js
    Description : The purpose of this file is to start the server at
                process.env.PORT
*/
// Require componenets
const express 	= require('express');
const app 		= require('./app/app');
const CONFIG 	= require('./config/config');
const https 	= require('https');
const http 		= require('http');
const fs 		= require('fs');
const server 	= express(); // Get an instace of express
const logger 	= CONFIG.logger;
const dblogger  = CONFIG.dblogger;
const MongoClient 	= require('mongodb').MongoClient;
server.use(express.json());
server.use(express.urlencoded({extended:true}));


var privateKey  = fs.readFileSync('./certs/server.key');
var certificate = fs.readFileSync('./certs/server.crt');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, server);

// Redirect all the requests to app
server.all('*', app);

// Connect to database
var dbUrl = CONFIG.db_url;
dblogger.debug('[%s] , Database URL : %s',__file,dbUrl);
//------------------------------------------------------------------------------
//	Setting up the connection with Database
//------------------------------------------------------------------------------
MongoClient.connect(dbUrl,{ useNewUrlParser: true }, function(err, db) {                            
    if(err)
    {
    	logger.error('[%s] , Error : %o',__file,err);
      	throw err;
    }
    CONFIG.db = db.db(CONFIG.db_name);
    
    dblogger.debug('[%s] , DB Connection object : %o',__file,CONFIG.db);
    logger.info('[%s] , Connected to database',__file);
    logger.info('[%s] , Starting HTTPS server',__file);
    /*server.listen(CONFIG.port,()=>{
        logger.info('[%s] , HTTPS server listening at port : %s',__file,CONFIG.port);
    });*/
    httpsServer.listen(CONFIG.port,()=>{
        logger.info('[%s] , HTTPS server listening at port : %s',__file,CONFIG.port);
        //logger.info('Application evironemet variables = %o ',CONFIG);
    });
});