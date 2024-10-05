const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
       type: String,
       required: false
    },
    status: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: false
    }
}, {timestamps: true});


const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;



