const jwt = require('jsonwebtoken')

const authorize = (req,res,next) => {
    try {
        var token = req.headers["authorization"]
        const decoded = jwt.verify(token, "heya")
        var user = decoded.user_id
        res.locals.user = user;
        next();
    } catch (error) {
        res.locals.error = error;
        next();
    }
    
}

module.exports = authorize