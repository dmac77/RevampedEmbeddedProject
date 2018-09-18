let db = require('../../db.js');

module.exports = (router) => {
    router.get('/temperatures/:dataPoints', (req, res) => {
        if (!isNaN(req.params.dataPoints) && req.params.dataPoints !== '') {
            let query = 'SELECT * FROM temperature ORDER BY timestamp DESC LIMIT ' + req.params.dataPoints;

            db.query(query, (err, result) => {
                if (err) {
                    return res.json(err);
                }
                if (result) {
                    return res.json(result.rows);
                }
            });
        }
    });

    router.get('/historicalTemperatures', (req, res) => {
        if (!isNaN(req.query.startTime) && !isNaN(req.query.endTime)) {
            let dbQuery = 'SELECT * FROM temperature WHERE timestamp BETWEEN $1 AND $2 ORDER BY timestamp ASC';

            db.query(dbQuery, [new Date(parseFloat(req.query.startTime)), new Date(parseFloat(req.query.endTime))], (err, result) => {
                if (err) {
                    return res.json(err);
                }
                if (result) {
                    return res.json(result.rows);
                }
            });
        }
    });
};