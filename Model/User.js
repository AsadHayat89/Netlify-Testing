const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  UUID: {
    type: String,
    unique: true,
  },
  ProfileName: {
    type: String,
  },
  Email: {
    type: String,
  },
  ProfileImageUrl: {
    type: String,
  },
});

module.exports = User;
