const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname:{
        type: 'string',
        required: true,
    },
    password:{
        type: 'string',
        required: true,
    },
    authenticated:{
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Users', userSchema);