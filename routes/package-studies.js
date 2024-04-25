const router = require('express').Router();
const PackageStudies = require('../models/PackageStudies');
const Studies = require('../models/ClinicalStudies');
const User = require('../models/User');
const { packageStudiesValidation } = require('../validation');

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
    const { error } = packageStudiesValidation(req.body);
    if (error) {
        return resp.status(400).send({ message: error.details[0].message });
    }

    // Checking if the user is already in the DB
    const codeExist = await PackageStudies.findOne({ code: req.body.code });
    if (codeExist) {
        return resp.status(400).send({ message: 'Code already exists' })
    }

    // create new clinical study
    const package = new PackageStudies({
        code: req.body.code,
        name: req.body.name,
        cost: req.body.cost,
        studies: req.body.studies,
        description: req.body.description,
        active: true
    });

    try {
        await package.save();
        resp.status(200).send({ study: package._id });
    } catch (error) {
        resp.status(400).send({ message: error });
    }
});

// GET ALL PACKAGE STUDIES BY STATUS
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

    let packages = await PackageStudies.find(conditions);


    // const ids =  [
    //     '662971c08f81f21e2a5a6abe'
    //     // '4ed3f117a844e0471100000d', 
    //     // '4ed3f18132f50c491100000e',
    // ];

    // const packagesTest = await Studies.find().where('_id').in(ids).exec();
    // const studyList: any;

    const packagesResponse = [];
    for (const pack of packages) {
        const studies = await Studies.find({ active: true }).where('_id').in(pack.studies).exec(); 
      
        const obj = {
            _id: pack._id,
            code: pack.code,
            name: pack.name,
            cost: pack.cost,
            studies: studies,
            description: pack.description,
            creationDate: pack.creationDate,
        }
        packagesResponse.push(obj);
    };
    
    return resp.status(200).json(packagesResponse);
});

// ENABLE - DISABLE A PACKAGE STUDY
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

        const update = await PackageStudies.updateOne(
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

// // UPDATE A CLINICAL STUDY
// // Only admins can update
// router.patch('/:id', async (req, resp) => {
//     const currentUser = req.headers['current-user'];
//     isAdmin = false;

//     ///////////THIS BLOCQ MUST BE REUSABLE
//     try {
//         const user = await User.findById(currentUser).select("-password");
//         isAdmin = user.role === 'ADMIN' ? true : false;
//     } catch(err) {
//         return resp.json({ message: 'Invalid ID' });
//     }

//     if (!isAdmin) {
//         return resp.status(401).json({ message: 'Unauthorized' });
//     }
//     ///////////// FIN THIS BLOCQ MUST BE REUSABLE

//     // Validate DATA before to be inserted in the DB
//     const { error } = clinicalStudiesValidation(req.body);
//     if (error) {
//         return resp.status(400).send({ message: error.details[0].message });
//     }

//     try {
//         // Validate if User can update and the email doesnt exists for another user
//         const codeExist = await Studies.findOne({ code: req.body.code });
//         if (codeExist) {
//             if (codeExist._id.valueOf() !== req.params.id) {
//                 return resp.status(400).send({ message: 'Code already exists.' });
//             }  
//         }

//         const obj = {
//             code: req.body.code,
//             name: req.body.name,
//             referenceValues: req.body.referenceValues,
//             cost: req.body.cost,
//             description: req.body.description,
//             active: true
//         }

//         const updateStudy = await Studies.updateOne(
//             { _id: req.params.id },
//             { $set: obj }
//         );

//         return resp.status(200).json(updateStudy);
//     }catch(err){
//         console.log(err);
//         return resp.status(500).json({ message: err });
//     } 
// });

module.exports = router;