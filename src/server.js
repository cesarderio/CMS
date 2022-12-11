'use strict';
const PORT = process.env.PORT || 3002;
const express = require('express');
const cors = require('cors');

const notFound = require('./middleware/handlers/404');
const errorHandler = require('./middleware/handlers/500');
const authRouter = require('./auth/authRouter');
const router = require('./routes');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.use('/api',router);

app.get('/', (req, res) => {
  res.status(200).send('Proof of life.');
});

app.use('*', notFound);
app.use(errorHandler);


module.exports = {
  server: app,
  start: () => app.listen(PORT, console.log('server is up on port', PORT)),
};
