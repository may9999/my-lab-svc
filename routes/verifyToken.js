require('dotenv').config();
const jwt = require('jsonwebtoken');
// let refreshTokens = []; 
// refreshTokens IS DEFINED AS GLOBAL IN app.js

module.exports = function (req, res, next) {
    const refreshToken = req.headers['authorization'];
    
    if (refreshToken == null) {
        return res.status(401).send('Access Denied'); // NO TOKEN
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).send('Invalid Token'); // NO TOKEN
    }
    jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid Token'); // NO TOKEN
        }
        refreshTokens = refreshTokens.filter(token => token == refreshToken);
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s'});
        refreshTokens.push(accessToken);
        req.user = user;
        next();
    });
}