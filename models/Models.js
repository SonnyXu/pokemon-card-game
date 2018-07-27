var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectID;
if (! process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  worldMap: {
    type: Array
  }
});


var User = mongoose.model('User', userSchema);

module.exports = {
  User: User
}
