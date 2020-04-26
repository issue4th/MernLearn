const APP_LISTEN_PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();

app.listen(APP_LISTEN_PORT, () =>
  console.log(`Server started on port ${APP_LISTEN_PORT}`)
);
