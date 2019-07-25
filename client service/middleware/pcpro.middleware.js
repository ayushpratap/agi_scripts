const MongoClient = require('mongodb').MongoClient;
const CONFIG = require('../config/config');
const winston = require('winston');
const pcpro = {};

pcpro.getUser = function(username,callback) 
{
  console.log("///***///  3 ///***///");
  // Connect to database
  var test = {};
  var res;
  var myJSONObject = {'Name':username};
  var dbo = db_connections.alexa;
	dbo.collection("users").findOne({"Name":username},function(err,result)
  {
    if(err)
    { 
      throw err;
    }
    callback(JSON.stringify(result));
  });
}
module.exports = pcpro;
