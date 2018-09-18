let db = require('../../db.js');

module.exports = (router) => {
    router.get('/gps/:dataPoints', (req, res) => {
        if (!isNaN(req.params.dataPoints) && req.params.dataPoints !== '') {
            let query = 'SELECT * FROM gps ORDER BY timestamp DESC LIMIT ' + req.params.dataPoints;

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
};