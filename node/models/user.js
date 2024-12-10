const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    picUrl: {type: String},
    //pinnedSpecies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Species'}],
    //reports: [{type: mongoose.Schema.Types.ObjectId, ref: 'Report'}]
    pinnedSpecies: [{type: String}],
    loc: {
        lat: {type: Number},
        lon: {type: Number}
    }
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

module.exports = { User };