const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FaceBookAuth = new Schema({
  name: String,
  UUID: {
    type: String,
    unique: true,
    required: true
  },
  ProfileName: {
    type: String,
    
    required: true
  },
  Email: {
    type: String,
      },
  ProfileImageUrl: {
    type: String,
    required:true
  },
});

module.exports = FaceBookAuth;
