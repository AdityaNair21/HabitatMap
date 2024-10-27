const mongoose = require('mongoose');

// Define the schema for a report
const ReportSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    speciesId: {type: String, required: true},
    location: { latitude : {type: Number, required: true}, longitude : {type: Number, required: true}},
    description: {type: String},
    }, 
    {timestamps: true});

// Create a model from the schema
const Report = mongoose.model('Report', ReportSchema);

module.exports = { Report };