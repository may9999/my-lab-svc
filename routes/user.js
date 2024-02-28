const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, resp) => {

    // Validate DATA before to be inserted in the DB
    const { error } = registerValidation(req.body);
    if (error) {
        return resp.status(400).send(error.details[0].message);
    }

    // Checking if the user is already in the DB
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return resp.status(400).send('Email already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new User
    const user = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    });
    
    try {
        const saveUser = await user.save();
        resp.status(200).send({ user: user._id });
    } catch (error) {
        resp.status(400).send(error);
    }
});

// GET ALL USERS BY STATUS
router.get('/status/:active', async (req, res) => {
    let active = false;
    if (req.params.active === 'active') {
        active = true;
    } else if (req.params.active === 'inactive') { 
        active = false;
    } else {
        return res.status(400).json({ message: 'invalid parameter' });
    } 

    const users = await User.find({ active: active }).select("-pass");
    return res.status(200).json(users);
});

// GET USER BY ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-pass");
        return res.status(200).json(user);
    } catch(err) {
        res.json({ message: 'Invalid ID' });
    }
});

// LOGIN
// router.post('/login', async (req, resp) => {
//     // Validate DATA before to be send
//     const { error } = loginValidation(req.body);
//     if (error) {
//         return resp.status(400).send(error.details[0].message);
//     }

//     // Checking if the user exists in the DB
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//         return resp.status(401).send('Email or Password Incorrect');
//     }

//     // Validate Password
//     const validPassword = await bcrypt.compare(req.body.password, user.password);

//     if (!validPassword) {
//         return resp.status(401).send('Email or Password Incorrect');
//     }

//     const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
//     resp.header('auth-token', token).send(token);
// });

module.exports = router;