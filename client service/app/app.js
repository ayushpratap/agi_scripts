/*
    Filename    : app.js
    Description :
*/
//----------------------------------------------------------------------------
require('magic-globals');
const express         = require('express');
const callController  = require('../controllers/call.controller');
const userController  = require('../controllers/user.controller');
const CONFIG          = require('../config/config');
const app             = express();
const router          = express.Router();
const expressHbs      = require('express-handlebars');
const logger          = CONFIG.logger;
const reqlogger       = CONFIG.reqlogger;
//----------------------------------------------------------------------------
//  Default route
//----------------------------------------------------------------------------
router.get('/',function(req,res) {
  logger.info("[%s] , Request received at router.get('/')",__file);
  reqlogger.debug('[%s] , Request object : %o',__file,req);
  logger.info('[%s] , Send the HTTPS request response : Hello',__file);
  
  // Send the HTTPS request response
  res.send("Hello");
});
//----------------------------------------------------------------------------
//  Make single call
//----------------------------------------------------------------------------
router.post('/api/makeCall',function(req,res) 
{
  logger.info("[%s] , Request received at router.post('/api/makeCall')",__file);
  reqlogger.debug('[%s] , Request object : %o',__file,req);
  var source      = req.body.source;
  var destination = req.body.destination;
  logger.info('[%s] , Calling : callController.makeCall with source : %s , destination : %s',__file,source,destination);
  callController.makeCall(source,destination,function(result)
  {
    if(1 ==  result)
    {
      logger.debug('[%s] , Result object : %o',__file,result);
      logger.info('[%s] , Sending response for HTTPS request => /api/makeCall :  Making Call',__file);

      // Send the HTTPS request response
      res.send("/api/makeCall :  Making Call");
    }
    else
    {
      logger.debug('[%s] , Result object : %o',__file,result);
      logger.info('[%s] , Sending response for HTTPS request => /api/makeCall :  Error',__file);

      // Send the HTTPS request response
      res.send("/api/makeCall :  Error");
    }
  });
});
//----------------------------------------------------------------------------
//  Make 3 party call
//----------------------------------------------------------------------------
router.post('/api/makeCallMulti',function(req,res){
  logger.info("[%s] , Request received at router.post('/api/makeCallMulti')",__file);
  reqlogger.debug('[%s] , Request object : %o',__file,req);

  var source        = req.body.source;
  var destinationA  = req.body.destinationA;
  var destinationB  = req.body.destinationB;

  logger.info('[%s] , Calling : callController.makeCall with source : %s , destinationA : %s , destinationB : %s',__file,source,destinationA,destinationB);
  callController.makeCallMulti(source,destinationA,destinationB,function(result){
    if(1 == result)
    {
      logger.debug('[%s] , Result object : %o',__file,result);
      logger.info('[%s] , Sending response for HTTPS request => /api/makeCallMulti : Making 3 party call',__file);

      //  Send the HTTPS request response
      res.send('/api/makeCallMulti : Making 3 party call');
    }
    else
    {
      logger.debug('[%s] , Result object : %o',__file,result);
      logger.info('[%s] , Sending response for HTTPS request => /api/makeCallMulti :  Error',__file);

      //  Send the HTTPS request response
      res.send('/api/makeCallMulti : Error');
    }
  });
});

//----------------------------------------------------------------------------
module.exports = router;