const { Report } = require('../models/report.js');

async function getReports(req, res) {
    try {
        const reports = await Report.find();
        if (reports.length === 0) {
            return res.status(404).json('msg: No reports found');
        }
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json('Error: ' + error);
    }
}

async function getReportById(req, res) {
    try {
        const report = await Report.findById(req.params.id);
        if (report === null) {
            return res.status(404).json('msg: No report found');
        }
        return res.status(200).json(report);
    } catch (error) {
        return res.status(500).json('Error: ' + error);
    }
}

async function getReportsByUserId(req, res) {
    try {
        const reports = await Report.find({ "user.userId": req.params.id });
        if (reports.length === 0) {
            return res.status(404).json('msg: No reports found');
        }
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json('Error: ' + error);
    }
}

async function getReportsBySpeciesId(req, res) {
    try {
        const reports = await Report.find({ "species.speciesId": req.params.id });
        if (reports.length === 0) {
            return res.status(404).json('msg: No reports found');
        }
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json('Error: ' + error);
    }
}

async function createReport(req, res) {
    try {
        console.log(req.body)

        const report = await Report.create(req.body);
        return res.status(201).json(report);
    } catch (error) {
        // console.log("errrrorrr")
        return res.status(500).json('Error: ' + error);
    }
}

async function updateReport(req, res) {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(report);
    } catch (error) {
        return res.status(500).json('Error: ' + error);
    }
}

async function deleteReport(req, res) {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        return res.status(200).json(report);
    } catch (error) {
        return res.status(500).json('Error: ' + error);
    }
}

async function getReportsBySearch(req, res) {
    try {
        const userId = req.query.userId;
        const speciesId = req.query.speciesId;
        const reports = await Report.find({ "user.userId": userId, "species.speciesId": speciesId });
        if (reports.length === 0) {
            return res.status(404).json('msg: No reports found');
        }
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json('Error: ' + error);
    }
}

async function getReportsBySearch(req, res) {
    //const search = req.query.speciesName? req.query.speciesName.split(" "): [];
    const speciesName = req.query.speciesName;
    if (!speciesName)
        return res.status(400).json("msg: search query is required");

    try {
        const reports = await Report.find({ "species.commonName": speciesName });//{ $regex: {$in: search }}
        if (!reports)
            return res.status(404).json("msg: No reports found");
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json("Error: " + error)
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