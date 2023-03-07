const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const socialMediaSchema = new Schema({
    email: { type: String, required: true },
    facebookLink: { type: String },
    instagramLink: { type: String },
    tiktokLink: { type: String },
    whatsappLink: { type: String },
  });
  
  // create model for social media links using schema
  const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);
  module.exports = SocialMedia;
