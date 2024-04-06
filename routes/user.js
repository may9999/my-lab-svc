const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { registerUserValidation, registerClientValidation, loginValidation } = require('../validation');
const { boolean } = require('@hapi/joi');

router.post('/register', async (req, resp) => {
    const currentUser = req.headers['current-user'];
    isAdmin = false;

    ///////////THIS BLOCQ MUST BE REUSABLE
    try {
        const user = await User.findById(currentUser).select("-password");
        isAdmin = user.role === 'ADMIN' ? true : false;
    } catch(err) {
        return resp.json({ message: 'Invalid ID' });
    }

    if (!isAdmin) {
        return resp.status(401).json({ message: 'Insuficientes Privilegios' });
    }
    ///////////// FIN THIS BLOCQ MUST BE REUSABLE
    

    // Validate DATA before to be inserted in the DB
    if (req.body.role === 'CLIENT') {
        const { error } = registerClientValidation(req.body);
        if (error) {
            return resp.status(400).send({ message: error.details[0].message });
        }
    } else { // USER
        const { error } = registerUserValidation(req.body);
        if (error) {
            return resp.status(400).send({ message: error.details[0].message });
        }
    }

    // Checking if the user is already in the DB
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return resp.status(400).send({ message: 'Email already exists' })
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
        role: req.body.role,
        code: req.body.code,
        address: req.body.address,
        contactNumber: req.body.contactNumber,
        neighborhood: req.body.neighborhood,
        city: req.body.city,
        zipCode: req.body.zipCode,
        passwordReset: true,
        active: true
    });

    try {
        // const saveUser = await user.save();
        await user.save();
        resp.status(200).send({ user: user._id });
    } catch (error) {
        resp.status(400).send({ message: error });
    }
});

// GET ALL USERS BY STATUS
router.get('', async (req, resp) => {
    let conditions = {};
    let active = true;
    if(req.query.hasOwnProperty('status')){
        if (req.query.status === 'active') {
            active = true;
        } else if (req.query.status === 'inactive') { 
            active = false;
        } else {
            return resp.status(400).json({ message: 'invalid parameter' });
        } 
    }
    conditions.active = active;

    if(req.query.hasOwnProperty('role')){
        conditions.role = req.query.role;
    }

    // const users = await User.find({ active: active }).select("-password");
    const users = await User.find(conditions).select("-password");
    return resp.status(200).json(users);
});

// GET USER BY ID
router.get('/:id', async (req, resp) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        return resp.status(200).json(user);
    } catch(err) {
        resp.json({ message: 'Invalid ID' });
    }
});

// ENABLE - DISABLE A USER
router.put('/activate/:id', async (req, resp) => {
    try {
        const currentUser = req.headers['current-user'];
        isAdmin = false;

        ///////////THIS BLOCQ MUST BE REUSABLE
        try {
            const user = await User.findById(currentUser).select("-password");
            isAdmin = user.role === 'ADMIN' ? true : false;
        } catch(err) {
            return resp.json({ message: 'Invalid ID' });
        }

        if (!isAdmin) {
            return resp.status(401).json({ message: 'Insuficientes Privilegios' });
        }
        ///////////// FIN THIS BLOCQ MUST BE REUSABLE

        const updateUser = await User.updateOne(
            {_id: req.params.id},
            {$set: 
                {
                    active: req.body.active,
                }
            }
        );

        resp.status(200).json(updateUser);
    }catch(err){
        console.log(err);
        resp.status(500).json({ message: err });
    } 
});

// UPDATE A USER
// Only admins can update users.. in future is we want 
// users can modify his own user then we have change the logic
router.patch('/:id', async (req, resp) => {
    const currentUser = req.headers['current-user'];
    isAdmin = false;

    ///////////THIS BLOCQ MUST BE REUSABLE
    try {
        const user = await User.findById(currentUser).select("-password");
        isAdmin = user.role === 'ADMIN' ? true : false;
    } catch(err) {
        return resp.json({ message: 'Invalid ID' });
    }

    if (!isAdmin) {
        return resp.status(401).json({ message: 'Unauthorized' });
    }
    ///////////// FIN THIS BLOCQ MUST BE REUSABLE

    // Validate DATA before to be inserted in the DB
    if (req.body.role === 'CLIENT') {
        const { error } = registerClientValidation(req.body);
        if (error) {
            return resp.status(400).send({ message: error.details[0].message });
        }
    } else { // USER
        const { error } = registerUserValidation(req.body);
        if (error) {
            return resp.status(400).send({ message: error.details[0].message });
        }
    }

    try {
        // Validate if User can update and the email doesnt exists for another user
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (user._id.valueOf() !== req.params.id) {
                return resp.status(400).send({ message: 'User already exists.' });
            }  
        }

        // // BEFORE UPDATE PASSWORD .. VALIDATING OLD PASS AND UPDATE WITH NEW ONE
        // // Validate Password
        // const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);

        // if (!validPassword) {
        //     return resp.status(401).send({ message: 'Incorrect Old Password' });
        // }

        const obj = {
            email: req.body.email,
            name: req.body.name,
            lastName: req.body.lastName,
            role: req.body.role,
            code: req.body.code,
            address: req.body.address,
            contactNumber: req.body.contactNumber,
            neighborhood: req.body.neighborhood,
            city: req.body.city,
            zipCode: req.body.zipCode,
            active: true,
            passReset: true
        }
        if (req.body.password != null) {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            obj.password = hashedPassword;
        }
        
        const updateUser = await User.updateOne(
            { _id: req.params.id },
            { $set: obj }
        );

        return resp.status(200).json(updateUser);
    }catch(err){
        console.log(err);
        return resp.status(500).json({ message: err });
    } 
});

module.exports = router;