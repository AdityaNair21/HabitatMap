const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://root:password@localhost:27017/habitatmap')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:\n' + 
        'Check if db container is running and mongodb service is up. ' +
        'If there is still an issue read this error msg:\n\n', err));

//const db = mongoose.connection;

// Define the schema for a report
const ReportSchema = new mongoose.Schema({
    userId: {type: Number, required: true},
    speciesId: {type: Number, required: true},
    location: { latitude : {type: Number, required: true}, longitude : {type: Number, required: true}},
    description: {type: String},
    }, 
    {timestamps: true});

// Create a model from the schema
const Report = mongoose.model('Report', ReportSchema);


module.exports = { Report, db };