require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.headers['authorization'];
    if (token == null) {
        return res.status(401).send('Access Denied'); // NO TOKEN
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err ) {
            return res.status(403).send('Invalid Token'); // NO ACCESS
        }

        req.user = user;
        next();
    });
}