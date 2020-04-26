const APP_LISTEN_PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();

// Connect database
const connectDatabase = require('./config/db');
connectDatabase();

// Intercept GET on /
app.get('/', (req, res) => res.send('API running'));

// Define API routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));

app.listen(APP_LISTEN_PORT, () =>
  console.log(`Server started on port ${APP_LISTEN_PORT}`)
);
