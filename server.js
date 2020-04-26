const APP_LISTEN_PORT = process.env.PORT || 5000;

const express = require('express');
const connectDatabase = require('./config/db');

const app = express();

// Connect database
connectDatabase();

app.listen(APP_LISTEN_PORT, () =>
  console.log(`Server started on port ${APP_LISTEN_PORT}`)
);

// Intercept GET on /
app.get('/', (req, res) => res.send('API running'));
