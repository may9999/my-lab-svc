const mongoose = require('mongoose');

const ClinicalStudiesSchema = mongoose.Schema({
    code: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    referenceValues: {
        type: String,
        require: true
    },
    cost: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: false
    },
    active: {
        type: Boolean,
        require: false,
        default: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Studies', ClinicalStudiesSchema);