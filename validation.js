// VALIDATION
const Joi = require('@hapi/joi');

// REGISTER VALIDATION FOR USER
const registerUserValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().required().min(6).email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required(),
        passwordReset: Joi.optional(),
        oldPassword: Joi.optional(),
        code: Joi.optional(),
        address: Joi.optional(),
        contactNumber: Joi.optional(),
        neighborhood: Joi.optional(),
        city: Joi.optional(),
        zipCode: Joi.optional()
    });
    return schema.validate(data);
}

// REGISTER VALIDATION FOR CLIENT
const registerClientValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        lastName: Joi.optional(),
        email: Joi.string().required().min(6).email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required(),
        passwordReset: Joi.optional(),
        oldPassword: Joi.optional(),
        code: Joi.string().required(),
        address: Joi.optional(),
        contactNumber: Joi.optional(),
        neighborhood: Joi.optional(),
        city: Joi.optional(),
        zipCode: Joi.optional()
    });
    return schema.validate(data);
}

// LOGIN VALIDATION
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().min(6).email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

// CLINICAL STUDIES VALIDATION
const clinicalStudiesValidation = (data) => {
    const schema = Joi.object({
        code: Joi.string().required(),
        name: Joi.string().required(),
        referenceValues: Joi.string().required(),
        cost: Joi.number().required(),
        description: Joi.optional()
    });
    return schema.validate(data);
}

module.exports.registerUserValidation = registerUserValidation;
module.exports.registerClientValidation = registerClientValidation;
module.exports.loginValidation = loginValidation;
module.exports.clinicalStudiesValidation = clinicalStudiesValidation;