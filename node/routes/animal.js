const express = require('express');
const router = express.Router();
const mockData = require('./mockData.json');

router.get('/', (req, res) => {
    const searchQuery = req.query.search?.toLowerCase() || '';
    const filteredAnimals = mockData.filter(
        (animal) =>
            animal.commonName.toLowerCase().includes(searchQuery) ||
            animal.scientificName.toLowerCase().includes(searchQuery)
    );
    res.json(filteredAnimals);
});

module.exports = router;