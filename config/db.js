const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('MongoDB connected..');
  } catch (err) {
    console.error(err.message);
    //if error exist process exit with failure
    process.exit(1);
  }
};

module.exports = connectDB;
