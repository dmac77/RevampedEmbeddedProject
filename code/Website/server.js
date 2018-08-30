let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let path = require('path');

//Port web server will listen on
const port = 8081;

//Static files in this directory
app.use(express.static(path.join(__dirname, '/public')));

//Parse requests with Body-Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Define file for API router
let api = require('./routes/api');
app.use('/api', api);

//Send all traffic to Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log("Server is running on port: " + port);
});