const express = require('express');
const app = express();
const port = 3000;

// Define the route for the root path
// Restful API

//Report APIs:
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