const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  dob: { type: String, required: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
});

module.exports = mongoose.model('Faculty', facultySchema);
