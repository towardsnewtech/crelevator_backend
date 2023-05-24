const express = require('express');
const cors = require('cors');
const log = require('./models/logger');
const config = require('./config').server ;
const fileupload = require('express-fileupload');
const db = require('./model/index');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors('*'));
app.use(fileupload());

const log4js = require('log4js');

app.use(log4js.connectLogger(log, {
    level: 'auto',
    statusRules: [
        { codes: [304], level: 'info' }
    ]
}));

// Router
const router = require('./router.js');
app.use('/', router);

app.use(express.static('public'));

const http = require('http');
const server = http.createServer(app);

server.listen(config.port, () => {
    console.log(`Server is listening at port ${config.port}`);
})