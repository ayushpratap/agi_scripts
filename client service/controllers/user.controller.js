
const pcpro = require('../middleware/pcpro.middleware');
const MongoClient = require('mongodb').MongoClient;

var userController = {};
userController.getUser=function (username,callback) {
  console.log("///***///  2 ///***///");
  console.log("username ="+username);
  console.log("call pcpro.getUser");
  pcpro.getUser(username,function(result){
    if(result == null)
    {
      result = null;
    }
    callback(result);
  });
}
userController.addUser=function(Name,Extension,Mobile_Number,callback){
  var dbo = db_connections.alexa;
  var dataObj = {
    "Name":Name,
    "Extension":Extension,
    "Mobile_Number":Mobile_Number
  };
  var result = 0;
  dbo.collection("users").insertOne(dataObj,function(err,res){
    if(err)
    { 
      throw err;
    }
    else
    {
      console.log("User added");
      result = 1;
      callback(result);
    }
  });
}
userController.getUserMulti=function(user1,user2,callback){
  var resultBody = {};

  // Get user1
  pcpro.getUser(user1,function(result_user1){
    if(result_user1 == 'null'){
      console.log("HELLOW");
      resultBody.user1 = null;
      resultBody.user2 = null;
      console.log("1. resultBody");
      console.log(resultBody);
      callback(JSON.stringify(resultBody));
    }
    else
    {
      var obj = JSON.parse(result_user1);
      var user1_tmp = {};
      user1_tmp.Extension = obj.Extension;
      resultBody.user1 = user1_tmp;

      // Get user2
      pcpro.getUser(user2,function(result_user2){
        if('null' == result_user2)
        {
          resultBody.user1 = null;
          resultBody.user2 = null;
          console.log("1. ");
          console.log(resultBody);
          callback(resultBody);
        }
        else
        {
          var obj = JSON.parse(result_user2);
          var user2_tmp = {};
          user2_tmp.Extension = obj.Extension;
          resultBody.user2 = user2_tmp;
          console.log("2. ");
          console.log(resultBody);
          callback(resultBody);
        }
      });
    }
  });
}
module.exports = userController;
