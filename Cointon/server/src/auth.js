const jwt = require("jsonwebtoken")

//================================================ Authentication ======================================================//

const authenticate = function (req, res, next) {
    try {
        
        const token = req.headers["x-api-key"]  // token from headers

        if (!token) {
            return res.status(400).send({ status: false, message: "token must be present in headers" })
        }
            
        jwt.verify(token, "secret-key-of-newton", function (err, decodedToken) {

            if (err) {
                if(err.message=="invalid token"){
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
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports.authenticate = authenticate