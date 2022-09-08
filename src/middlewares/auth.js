//===========================
const jwt = require("jsonwebtoken");




//==================== Authentication ==========================

let authentication = function (req , res , next){
    //console.log("innerAuth");
    try {

        // taking encrypted token from header 
        //let token = req.headers['x-api-key'] 
        let token = req.headers["x-api-key"] || req.headers["x-Api-Key"];
        
        // return this message if token is not present in headers
        if(!token) return res.status(403).send({message: "token must be present" })
        
        // perforing this operation to decode the token
        let decodedToken = jwt.verify( token , "reunion")
        
        // if returned decoded token is undefined
        if(!decodedToken){
            return res.status(403).send({status: false , msg: "Invalid authentication Token in request"})
        }
 
        // set decoded token value in request
       // req.decodedToken = decodedToken
        req.userId = decodedToken.userId

        next()
    } 
    catch(err) {
        return res.status(500).send({ status: false, msg: err.message });
    }

}

module.exports.authentication = authentication