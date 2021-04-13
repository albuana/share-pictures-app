const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:{
        type: 'string',
        required: true,
    },
    description:{
        type: 'string',
        required: false,
    },
    likes:{
        type: Number,
        default: 0,
    },
    user: {
         type: Schema.Types.ObjectId, 
         required: true,
        },
    date:{
        type: Date,
        default: Date.now,
    },
    photo:{
        type: String,
        required:false,
    }
});

module.exports = mongoose.model('Posts', postSchema);
