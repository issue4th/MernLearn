const mongoose = require('mongoose');
const config = require('config');
const dbConnectionUri = config.get('mongoURI');

const connectDatabase = async () => {
  try {
    await mongoose.connect(dbConnectionUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
