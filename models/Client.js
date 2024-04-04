const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: true,
        min: 6
    },
    password: {
        type: String,
        require: true,
        // max: 255,
        min: 6
    },
    role: { // ADMIN/TECHNICAL/MANAGER/USER/CLIENT
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: false
    },
    contactNumber: {
        type: String,
        require: false
    },
    neighborhood: {
        type: String,
        require: false
    },
    city: {
        type: String,
        require: false
    },
    zipCode: {
        type: String,
        require: false
    },
    active: {
        type: Boolean,
        require: false,
        default: true
    },
    passReset: {
        type: Boolean,
        require: false,
        default: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UsersSchema);