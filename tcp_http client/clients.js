/*
    Filename: clients.js
    Description:
 */
//------------------------------------------------------------------------------
require('magic-globals');
const express       = require('express');
const net           = require('net');
const request         = require('request');
var CONFIG          = require('./config/config');
const JsonSocket    = require('json-socket');
const logger        = CONFIG.logger;
var options         = {};
//------------------------------------------------------------------------------
console.log(CONFIG.tcp_server_host);
console.log(CONFIG.tcp_server_port);
// Create client socket
logger.info('[%s] , Creating client socket',__file);
const tcpClient = net.createConnection(CONFIG.tcp_server_port,CONFIG.tcp_server_host);

//  Handle connect event
tcpClient.on('connect',function(){
    logger.info("[%s] , Connected to the server at %s:%s",__file,CONFIG.tcp_server_host,CONFIG.tcp_server_port);
    logger.info("[%s] , TCP client info %s",__file,tcpClient.address().address);
});

//  Handle data event
tcpClient.on('data',function(data){
    logger.info('[%s] , Data recevied',__file);

    // Convert the Buffer to JSON object
    let reqInfo = JSON.parse(data.toString());
    logger.debug('[%s] , Request info : %o ',__file,reqInfo);
    // Get the route of the request
    switch(reqInfo.route){
        case '/':
            logger.info("[%s] , Case : '/'",__file);
            
            // Set the options for HTTPS request
            options.method              = "GET";
            options.url                 = CONFIG.client_service_url+reqInfo.route;
            options.rejectUnauthorized  = false;
            options.requestCert         = false;
            options.body                = reqInfo.data;

            logger.debug('[%s] , HTTPS request options : %o',__file,options);
            
            // Make HTTPS request
            request(options,function(error,res,body){
                logger.info('[%s] , Response received for HTTPS request',__file);
                options = {};
                logger.debug('[%s] , Cleared HTTPS options : %o ',__file,options);
                logger.info('[%s] , Response body : %o ',__file,body);
            });
        break;
        case '/api/makeCall':
            logger.info("[%s] , Case : /api/makeCall",__file);

            // Set the options for HTTPS request
            options.method              = "POST";
            options.url                 = CONFIG.client_service_url+reqInfo.route;
            options.json                = true;
            options.rejectUnauthorized  = false;
            options.requestCert         = false;
            options.body                = reqInfo.data;

            logger.debug('[%s] , HTTPS request options : %o',__file,options);

            //  Make HTTPS request
            request(options,function(error,res,body){
                logger.info('[%s] , Response received for HTTPS request',__file);
                options = {};
                logger.debug('[%s] , Cleared HTTPS options : %o',__file,options);
                logger.info('[%s] , Request body : %o ',__file,body);
            });
        break;
        case '/api/makeCallMulti':
            logger.info("[%s] , Case : /api/makeCallMulti",__file);

            //  Set the options for HTTPS request
            options.method              = "POST";
            options.url                 = CONFIG.client_service_url+reqInfo.route;
            options.json                = true;
            options.rejectUnauthorized  = false;
            options.requestCert         = false;
            options.body                = reqInfo.data;

            logger.debug('[%s] , HTTPS request options : %o',__file,options);

            // Make HTTPS request
            request(options,function(error,res,body){
                logger.info('[%s] , Response received for HTTPS request',__file);
                options = {};
                logger.debug('[%s] , Cleared HTTPS options : %o',__file,options);
                logger.info('[%s] , Response body : %o',__file,body);
            });
         break;
        default:
            logger.error('[%s] , No matching case',__file);
    }
});

//  Handle error event
tcpClient.on('error',function(err){
    logger.error('[%s] , Error : %o',__file,err);
});
//------------------------------------------------------------------------------
