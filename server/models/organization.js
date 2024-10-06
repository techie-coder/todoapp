const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
    }],
    projects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: false
    }]
}, {timestamps: true});


const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
