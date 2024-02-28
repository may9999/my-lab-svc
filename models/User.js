const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
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
    role: { // ADMIN/TECHNICAL/MANAGER/USER/CUSTOMER
        type: String,
        require: true
    }, 
    active: {
        type: Boolean,
        require: true,
        default: true
    },
    passReset: {
        type: Boolean,
        require: true,
        default: true
    }, 
    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UsersSchema);