// VALIDATION
const Joi = require('@hapi/joi');

// REGISTER VALIDATION
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().required().min(6).email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required(),
        passwordReset: Joi.optional(),
        oldPassword: Joi.optional()
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

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;