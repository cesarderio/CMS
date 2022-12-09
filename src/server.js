'use strict';
const PORT = process.env.PORT || 3002;
const express = require('express');
const cors = require('cors');

//---------------to build------
const notFound = require('./middleware/handlers/404');
const errorHandler = require('./middleware/handlers/500');

// const Authrouter = require('./auth/router');

const router = require('./routes');

//--------------------------------

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use(Authrouter);
app.use('/api',router);

app.use('*', notFound);
app.use(errorHandler);


module.exports = {
  server: app,
  start: () => app.listen(PORT, console.log('server is up on port', PORT)),
};
