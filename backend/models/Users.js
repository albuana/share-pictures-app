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
    favourites:{
        type: [Schema.Types.ObjectId], 
        required: false,
    },
    likes:{
        type: [Schema.Types.ObjectId], 
        required: false,
    }
});

module.exports = mongoose.model('Users', userSchema);
