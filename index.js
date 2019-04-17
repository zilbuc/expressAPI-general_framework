/*
 * Server
 *
 */

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

const app = express();

// DB Setup
mongoose.connect('mongodb://localhost/nutridb', {useNewUrlParser: true});

// App setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);


// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(port, () => console.log(`App is listening on port ${port}`));
