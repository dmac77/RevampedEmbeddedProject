let express = require('express');
let router = express.Router({});

let db = require('../db.js');

router.get('/temperatures/:dataPoints', (req, res) => {
    //TODO: Scrub inputs
    let query = 'SELECT * FROM temperature ORDER BY timestamp DESC LIMIT ' + req.params.dataPoints;

    db.query(query, (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result) {
            return res.json(result.rows);
        }
    });
});

router.get('/historicalTemperatures', (req, res) => {
    //TODO: Scrub inputs
    let dbQuery = 'SELECT * FROM temperature WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp ASC';

    db.query(dbQuery, [new Date(parseFloat(req.query.startTime)), new Date(parseFloat(req.query.endTime))], (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result) {
            return res.json(result.rows);
        }
    });
});

router.get('/acceleration/:dataPoints', (req, res) => {
    //TODO: Scrub inputs
    let query = 'SELECT * FROM acceleration ORDER BY timestamp DESC LIMIT ' + req.params.dataPoints;

    db.query(query, (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result) {
            return res.json(result.rows);
        }
    });
});

router.get('/historicalAcceleration', (req, res) => {
    //TODO: Scrub inputs
    let dbQuery = 'SELECT * FROM acceleration WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp ASC';

    db.query(dbQuery, [new Date(parseFloat(req.query.startTime)), new Date(parseFloat(req.query.endTime))], (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result) {
            return res.json(result.rows);
        }
    });
});

router.get('/rpm/:dataPoints', (req, res) => {
    //TODO: Scrub inputs
    let query = 'SELECT * FROM rpm ORDER BY timestamp DESC LIMIT ' + req.params.dataPoints;

    db.query(query, (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result) {
            return res.json(result.rows);
        }
    });
});

router.get('/historicalRPM', (req, res) => {
    //TODO: Scrub inputs
    let dbQuery = 'SELECT * FROM rpm WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp ASC';

    db.query(dbQuery, [new Date(parseFloat(req.query.startTime)), new Date(parseFloat(req.query.endTime))], (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result) {
            return res.json(result.rows);
        }
    });
});

router.get('/speed/:dataPoints', (req, res) => {
    //TODO: Scrub inputs
    let query = 'SELECT * FROM speed ORDER BY timestamp DESC LIMIT ' + req.params.dataPoints;

    db.query(query, (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result) {
            return res.json(result.rows);
        }
    });
});

router.get('/historicalSpeed', (req, res) => {
    //TODO: Scrub inputs
    let dbQuery = 'SELECT * FROM speed WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp ASC';

    db.query(dbQuery, [new Date(parseFloat(req.query.startTime)), new Date(parseFloat(req.query.endTime))], (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result) {
            return res.json(result.rows);
        }
    });
});

router.get('/gps/:dataPoints', (req, res) => {
    //TODO: Scrub inputs
    let query = 'SELECT * FROM gps ORDER BY timestamp DESC LIMIT ' + req.params.dataPoints;

    db.query(query, (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result) {
            return res.json(result.rows);
        }
    });
});

module.exports = router;