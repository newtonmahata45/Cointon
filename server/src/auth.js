const jwt = require("jsonwebtoken")

//================================================ Authentication ======================================================//

const authenticate = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];  // token from headers
        // console.log("token=>",token)
        if (!token) {
            return res.status(400).send({ status: false, message: "Token must be present in headers" })
        }
            
        jwt.verify(token, "secret-key-of-newton", function (err, decodedToken) {

            if (err) {
                console.log("=>",err.message)
                if(err.message=="invalid token"||err.message=="jwt malformed"){
                    return res.status(401).send({ status: false, message: "Token in not valid" })
                }
                return res.status(401).send({ status: false, message: err.message })
            }
            else{
                req.loginUserId = decodedToken.id;       // golbelly  in  decodedToken.id 
                next()
            }
        })
    }
    catch (error) {
        console.log("auth catch error =>", error)
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports.authenticate = authenticate