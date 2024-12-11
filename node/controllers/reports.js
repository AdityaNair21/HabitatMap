const { Report } = require('../models/report.js');

function checkForEmptyReports(reports, next) {
    if (reports.length === 0) {
        const error = new Error('No reports found');
        error.status = 404;
        return next(error);
    }
}

function convertMilesToRadians(miles) {
    return miles / 3958.8;
}

async function getReports(req, res, next) {
    try {
        const reports = await Report.find();
        checkForEmptyReports(reports, next);
        return res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
}

async function getReportById(req, res, next) {
    try {
        const report = await Report.findById(req.params.id);
        if (report === null) {
            const error = new Error('No report found');
            error.status = 404;
            return next(error);
        }
        return res.status(200).json(report);
    } catch (error) {
        next(error);
    }
}

async function getReportsByUserId(req, res, next) {
    try {
        const reports = await Report.find({ "user.userId": req.params.id });
        checkForEmptyReports(reports, next);
        return res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
}

async function getReportsBySpeciesId(req, res, next) {
    try {
        const reports = await Report.find({ "species.speciesId": req.params.id });
        checkForEmptyReports(reports, next);
        return res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
}

async function createReport(req, res, next) {
    try {
        console.log(req.body)
        const report = await Report.create(req.body);
        return res.status(201).json(report);
    } catch (error) {
        next(error);
    }
}

async function updateReport(req, res, next) {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(report);
    } catch (error) {
        next(error);
    }
}

async function deleteReport(req, res, next) {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        return res.status(200).json(report);
    } catch (error) {
        next(error);
    }
}

async function getReportsBySearch(req, res, next) {
    const { speciesName, speciesRadius, userLat, userLon } = req.query;

    if (!speciesName || !speciesRadius || !userLat || !userLon) {
        const error = new Error('Please provide a species name, radius, and user\'s location');
        error.status = 400;
        return next(error);
    }

    try {
        const reports = await Report.find({
            $text: { $search: `"${speciesName}"` },
            loc: {
                $geoWithin: {
                    $centerSphere:
                        [[userLon, userLat],
                        convertMilesToRadians(Number(speciesRadius))]
                }
            }
        });

        checkForEmptyReports(reports, next);
        return res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getReports,
    getReportById,
    getReportsByUserId,
    getReportsBySpeciesId,
    createReport,
    updateReport,
    deleteReport,
    getReportsBySearch
};