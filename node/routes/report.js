const express = require('express');
const router = express.Router();
const { Report } = require('../models/report.js');
// Example: server side rendering and redirecting the form data to the appropriate route
router.get('/home', (req, res) => {
    return res.send(
        `<form action="/reports/filters" method="get">
        <label for="reportId">Enter Report ID:</label>
        <input type="text" id="reportId" name="reportId"><br><br>
        <label for="userId">Enter User ID:</label>
        <input type="text" id="userId" name="userId"><br><br>
        <label for="speciesId">Enter Species ID:</label>
        <input type="text" id="speciesId" name="speciesId"><br><br>
        <input type="submit" value="Submit">
        </form>`
    );
});

router.get('/', (req, res) => {
    res.send('All reports will be returned in json format using res.json()');
});

// Alternative to individual gets using query params
router.get('/filters', (req, res) => {
    const reportId = req.query.reportId;
    const userId = req.query.userId;
    const speciesId = req.query.speciesId;
    res.send(
        'All reports will be returned in json format using res.json() after applying filters\n' +
        "reportId: " + reportId + "\n" + "userId: " + userId + "\n" + "speciesId: " + speciesId
    );
});

router.get('/:id', async (req, res) => {
    const reportDoc =  await Report.find({"_id":req.params.id}).lean();
    return res.status(200).send(reportDoc);
});

router.get('/user/:id', (req, res) => {
    res.send('All reports for a user will be returned in json format using res.json()\n' + 'userId: ' + req.params.id);
});

router.get('/species/:id', (req, res) => {
    res.send('All reports for a user will be returned in json format using res.json()\n' + 'speciesId: ' + req.params.id);
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const createdReport = await Report.create(req.body);
    return res.status(201).json(createdReport);
});

router.patch('/:id', (req, res) => {
    res.send('A report will be updated\n' + 'reportId: ' + req.params.id);
});

router.delete('/:id', (req, res) => {
    res.send('A report will be deleted\n' + 'reportId: ' + req.params.id);
});

module.exports = router;