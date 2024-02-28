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
        resp.send({ user: user._id });
    } catch (error) {
        resp.status(400).send(error);
    }
});

module.exports = router;