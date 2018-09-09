let express = require('express');
let router = express.Router({});

require('./acceleration/acceleration.routes')(router);
require('./gps/gps.routes')(router);
require('./rpm/rpm.routes')(router);
require('./speed/speed.routes')(router);
require('./temperature/temperature.routes')(router);

module.exports = router;