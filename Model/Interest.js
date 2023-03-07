const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interestSchema = new Schema({
  ID: Number,
  Name: String,
  en: String,
  he: String
});

const Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;
