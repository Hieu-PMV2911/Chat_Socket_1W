const mongoose = require('mongoose');

function connectDB() {
  mongoose.connect('mongodb+srv://hieu01672549298:hieu2911@cluster0.wbmda05.mongodb.net/ChatApp1W?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('Connected to MongoDB database');
  });
}
module.exports = connectDB;
