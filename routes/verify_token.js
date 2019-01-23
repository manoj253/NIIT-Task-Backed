var jwt    = require('jsonwebtoken');
var moment = require('moment');
module.exports = function(req, res, next) {
  var token = req.body.token || req.query.token || req.params.token || req.headers['x-access-token'];
  if (token) {
  // verifies secret and checks exp
    jwt.verify(token,"secret", function(err, decoded) {      
      if (err) {
          console.log("verify-token jwt.verify : ",err);
        return res.status(401).send({ success: false, message: 'Failed to authenticate token.',err:err });
      } else if (!decoded.id) {
        console.log("users id not found jwt.verify : ",err);
        return res.status(401).send({ success: false, message: 'Failed to authenticate token.'});
      } else if(moment().valueOf() > parseInt(decoded.exp)){
        err = {
          token_expired_at : moment(decoded.exp).format("YYYY-MM-DD HH:mm:ss"),
          token_issued_at   : moment(decoded.iat).format("YYYY-MM-DD HH:mm:ss")         
        };
        return res.status(401).send({success: false,message: "Your token has been expired.",err :err});
      }else {
        req.decoded = decoded;  
        next();
      }
    });
  } else {
      // if there is no token
      // return an error
      return res.status(403).send({ success: false,message: 'No token provided.'});
  }
};

