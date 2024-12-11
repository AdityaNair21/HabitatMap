const mongoose = require('mongoose');

// Define the schema for a species
const SpeciesSchema = new mongoose.Schema({
    commonName: {type: String, required: true},
    scientificName: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    picUrl: {type: String, required: true},
    /* naturalHabitat: {loc: {
        lat: {type: Number, required: true},
        lon: {type: Number, required: true}
    }, radius: {type: Number, required: true}}, */
},);

// Create a model from the schema
const Species = mongoose.model('Species', SpeciesSchema);

module.exports = { Species };