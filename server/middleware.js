const JWT_SECRET = "secret";
var jwt = require('jsonwebtoken');


module.exports = {
    auth : (req, res, next) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader){
            return res.status(483).json({msg: "Missing auth header"});
        }
        const decoded = jwt.verify(authHeader, JWT_SECRET);
        if (decoded && decoded.id){
            req.user = decoded;
            next();
        }
        else{
            return res.send(403).json({msg: "Incorrect token"});
        }
    }
}
