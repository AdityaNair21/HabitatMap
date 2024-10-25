const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Define the route for the root path
// Restful API

//Report APIs:
//example: server side rendering and redirecting the form data to the appropriate route
app.get('/', (req, res) => {
  return res.send(
    `<form action="/reports/filters" method="get">
    <label for="reportId">Enter Report ID:</label>
    <input type="text" id="reportId" name="reportId"><br><br>
    <label for="userId">Enter User ID:</label>
    <input type="text" id="userId" name="userId"><br><br>
    <label for="speciesId">Enter Species ID:</label>
    <input type="text" id="speciesId" name="speciesId"><br><br>
    <input type="submit" value="Submit">
    </form>`);
});

app.get('/reports', (req, res) => {
  res.send('All reports will be returned in json format using res.json()');
});

//alternative to individual gets using query params
app.get('/reports/filters', (req, res) => {
    const reportId = req.query.reportId;
    const userId = req.query.userId;
    const speciesId = req.query.speciesId;
    res.send('All reports will be returned in json format using res.json() after applying filters\n' +
        "reportId: " + reportId + "\n" + "userId: " + userId + "\n" + "speciesId: " + speciesId);
});

app.get('/reports/:id', (req, res) => {
    res.send('A single report will be returned in json format using res.json()\n' + 'reportId: ' + req.params.id);
});

app.get('/reports/user/:id', (req, res) => {
    res.send('All reports for a user will be returned in json format using res.json()\n' + 'userId: ' + req.params.id);
});

app.get('/reports/species/:id', (req, res) => {
    res.send('All reports for a user will be returned in json format using res.json()\n' + 'speciesId: ' + req.params.id);
});

app.post('/reports', (req, res) => {
    res.send('A new report will be created\n' + 'reportId: ' + req.body.reportId);
});

app.patch('/reports/:id', (req, res) => {
    res.send('A report will be updated\n' + 'reportId: ' + req.params.id);
});

app.delete('/reports/:id', (req, res) => {
    res.send('A report will be deleted\n' + 'reportId: ' + req.params.id);
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});