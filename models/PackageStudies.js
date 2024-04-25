const mongoose = require('mongoose');

// https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array

const PackageStudiesSchema = mongoose.Schema({
    code: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    cost: {
        type: Number,
        require: true
    },
    // studies: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     require: true,
    //     ref: 'Studies'
    // }],
    studies: {
        type: Array,
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

module.exports = mongoose.model('PackageStudies', PackageStudiesSchema);