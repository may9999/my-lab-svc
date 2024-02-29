require('dotenv').config();
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loginValidation } = require('../validation');

let refreshTokens = []; // TODO: find another way to store the tokens (redis cache)

// LOGIN
router.post('/login', async (req, resp) => {
    // Validate DATA before to be send
    const { error } = loginValidation(req.body);
    if (error) {
        return resp.status(400).send(error.details[0].message);
    }

    // Checking if the user exists in the DB
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return resp.status(401).send('Email or Password Incorrect');
    }

    // Validate Password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return resp.status(401).send('Email or Password Incorrect');
    }

    const userObj = { id: user._id };
    const accessToken = generateAccessToken(userObj);
    const refreshToken = jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '60s'});
    refreshTokens.push(refreshToken);// TODO: find another way to store the tokens (redis cache)

    return resp.status(200).json({userObj, accessToken, refreshToken });
});

// router.post('/login', (req, res) => {

//     // Validate DATA before to be send
//     const { error } = loginValidation(req.body);
//     if (error) {
//         return resp.status(400).send(error.details[0].message);
//     }
    
//     User.findOne({ email: req.body.email }, function(err, user) {
//         if (err) {
//             return res.status(400).send(err);
//         } else if (!user) {
//             return res.status(404).send(err);
//         } else {
//             bcrypt.compare(req.body.pass, user.pass, (errComparing, isMatch) => {
//                 if (errComparing) {
//                     console.log(errComparing);
//                     return res.sendStatus(500);
//                 }
//                 if (!isMatch) {
//                     return res.sendStatus(403);
//                 }
            
//                 const userObj = { id: user._id };
//                 const accessToken = generateAccessToken(userObj);
//                 const refreshToken = jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '60s'});
//                 refreshTokens.push(refreshToken);// TODO: find another way to store the tokens (redis cache)

//                 return res.status(200).json({userObj, accessToken, refreshToken });
//                 // const token = jwt.sign({user: user._id}, process.env.SESSION_SECRET); // , { expiresIn: 10 } seconds
//             });
//         }
//     });
// });

// router.post('/token', (req, res) => { // for refreshing token
//     const refreshToken = req.body.token;
//     if (refreshToken == null) {
//         return res.status(401).send('Invalid Token'); // NO TOKEN
//     }
//     if (!refreshTokens.includes(refreshToken)) {
//         return res.status(403).send('Invalid Token'); // NO TOKEN
//     }
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).send('Access Denied'); // NO TOKEN
//         }

//         // const accessToken = generateAccessToken({ name: user.name });
//         refreshTokens = refreshTokens.filter(token => token !== req.body.token);
//         const accessToken = jwt.sign({ name: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s'});
//         return res.json({ accessToken: accessToken });
//     });
// });

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s'});
}

router.post('/logout', (req, res, next) => {
    refreshTokens = refreshTokens.filter(token => token == req.headers['authorization']);
    res.status(204).json({});
    next();
});  

module.exports = router;