const router = require('express').Router();
const Studies = require('../models/ClinicalStudies');
const User = require('../models/User');
const { clinicalStudiesValidation } = require('../validation');

router.post('/', async (req, resp) => {
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
    const { error } = clinicalStudiesValidation(req.body);
    if (error) {
        return resp.status(400).send({ message: error.details[0].message });
    }

    // Checking if the user is already in the DB
    const codeExist = await Studies.findOne({ code: req.body.code });
    if (codeExist) {
        return resp.status(400).send({ message: 'Code already exists' })
    }

    // create new clinical study
    const clinical = new Studies({
        code: req.body.code,
        name: req.body.name,
        referenceValues: req.body.referenceValues,
        cost: req.body.cost,
        description: req.body.description,
        active: true
    });

    try {
        await clinical.save();
        resp.status(200).send({ study: clinical._id });
    } catch (error) {
        resp.status(400).send({ message: error });
    }
});

// GET ALL CLINICAL STUDIES BY STATUS
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

    // const users = await User.find({ active: active }).select("-password");
    const studies = await Studies.find(conditions);
    return resp.status(200).json(studies);
});

// // GET USER BY ID
// router.get('/:id', async (req, resp) => {
//     try {
//         const user = await User.findById(req.params.id).select("-password");
//         return resp.status(200).json(user);
//     } catch(err) {
//         resp.json({ message: 'Invalid ID' });
//     }
// });

// ENABLE - DISABLE A CLINICAL STUDY
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

        const update = await Studies.updateOne(
            {_id: req.params.id},
            {$set: 
                {
                    active: req.body.active,
                }
            }
        );

        resp.status(200).json(update);
    }catch(err){
        console.log(err);
        resp.status(500).json({ message: err });
    } 
});

// UPDATE A CLINICAL STUDY
// Only admins can update
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
    const { error } = clinicalStudiesValidation(req.body);
    if (error) {
        return resp.status(400).send({ message: error.details[0].message });
    }

    try {
        // Validate if User can update and the email doesnt exists for another user
        const codeExist = await Studies.findOne({ code: req.body.code });
        if (codeExist) {
            if (codeExist._id.valueOf() !== req.params.id) {
                return resp.status(400).send({ message: 'Code already exists.' });
            }  
        }

        const obj = {
            code: req.body.code,
            name: req.body.name,
            referenceValues: req.body.referenceValues,
            cost: req.body.cost,
            description: req.body.description,
            active: true
        }

        const updateStudy = await Studies.updateOne(
            { _id: req.params.id },
            { $set: obj }
        );

        return resp.status(200).json(updateStudy);
    }catch(err){
        console.log(err);
        return resp.status(500).json({ message: err });
    } 
});

module.exports = router;