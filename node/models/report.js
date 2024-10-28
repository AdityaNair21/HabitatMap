const mongoose = require('mongoose');

// Define the schema for a report
const ReportSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    speciesId: {type: String, required: true},
    location: { latitude : {type: Number, required: true}, longitude : {type: Number, required: true}},
    description: {type: String},
    }, 
    {timestamps: true});

// Define the schema for a report
const ReportSchema2 = new mongoose.Schema({
    // user aggregate 
    user: {
        userId: {type: String, required: true},
        username: {type: String, required: true},
        picUrl: {type: String, required: true}
    },
    // species aggregate. This information will rarely change.
    species: {
        speciesId: {type: String, required: true},
        commonName: {type: String, required: true},
        scientificName: {type: String, required: true},
        description: {type: String, required: true},
        picUrl: {type: String, required: true}
    },
    loc: {
        lat: {type: Number, required: true},
        lon: {type: Number, required: true}
    },
    description: {type: String},
    picUrl: [{type: String}],
}, 
{timestamps: true});

// Create a model from the schema
const Report = mongoose.model('Report', ReportSchema2);

module.exports = { Report };