const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    todoIds : [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo',
            required: false
        }
    ],
    deadline : {
        type: Date,
        required: false
    }
}, {timestamps: true})

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
