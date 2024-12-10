const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reports.js');

/*
// Example: server side rendering and redirecting the form data to the appropriate route
router.get('/home', (req, res) => {
    return res.send(
        `<form action="/reports/filters" method="get">
        <label for="userId">Enter User ID:</label>
        <input type="text" id="userId" name="userId"><br><br>
        <label for="speciesId">Enter Species ID:</label>
        <input type="text" id="speciesId" name="speciesId"><br><br>
        <input type="submit" value="Submit">
        </form>`
    );
});

// Alternative to individual gets using query params
router.get('/filters', (req, res) => {
    const userId = req.query.userId;
    const speciesId = req.query.speciesId;
    res.send(
        'All reports will be returned in json format using res.json() after applying filters\n' +
         + "\n" + "userId: " + userId + "\n" + "speciesId: " + speciesId
    );
});
*/

router.route('/search')
    .get(reportController.getReportsBySearch);

router.route('/')
    .get(reportController.getReports)
    .post(reportController.createReport);

router.route('/:id')
    .get(reportController.getReportById)
    .patch(reportController.updateReport)
    .delete(reportController.deleteReport);

router.route('/user/:id')
    .get(reportController.getReportsByUserId);

router.route('/species/:id')
    .get(reportController.getReportsBySpeciesId);



/*
//alternate way to configure routes using individual 
router.get('/', reportController.getReports);

router.get('/:id', reportController.getReportById);

router.get('/user/:id', reportController.getReportsByUserId);

router.get('/species/:id', reportController.getReportsBySpeciesId);

router.post('/', reportController.createReport);

router.patch('/:id', reportController.updateReport);

//put is to update the entire document
//router.put('/:id', reportController.updateReport);

router.delete('/:id', reportController.deleteReport);
*/

module.exports = router;