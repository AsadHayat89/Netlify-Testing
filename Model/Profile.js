const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  name: {
    type: String,
    
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  language: {
    type: String,
    
  },
  age: {
    type: String,
    
  },
  location: {
    type: String,
    
  },
  locationLat: {
    type: Number,
    
  },
  locationLng: {
    type: Number,
    
  },
  interestId: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
  gender: {
    type: String,
    
  },
  educationLevel: {
    type: String,
    
  },
  points:{
    type:String,
  },
  Country:{
    type:String,
  }
});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;
