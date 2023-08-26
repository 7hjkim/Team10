var aws = require('aws-sdk');
var docClient  = new aws.DynamoDB.DocumentClient();
exports.handler =  (event,context,callback) => {
   let date = new Date();
   let params={
        TableName:'team10user-dev',
        Item:{
          'email':event.request.userAttributes.email,
          'username':"username",
          'address':event.request.userAttributes.address,
          'createdAt': date.toISOString(),
          'updatedAt': date.toISOString(),
            }
   		};
  docClient.put(params, (err,data)=>{
  			if(err) {
                     var error = new Error("Failed to save new user");
                     callback(error, event);
            }else{
              		console.log(params.Item);
                    callback(null, event);
            }
  });
};