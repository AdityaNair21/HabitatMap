const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reports.js');


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


module.exports = router;