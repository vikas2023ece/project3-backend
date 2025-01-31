const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  fatherName: { type: String, required: true },
  fatherPhoneNumber: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  presentPeriods: { type: Number, default: 0 },
  absentPeriods: { type: Number, default: 0 },
  odPeriods: { type: Number, default: 0 },
  attendance: [
    {
      date: { type: String, required: true },
      period: { type: Number, required: true },
      status: { type: String, enum: ["Present", "Absent", "OD"], required: true },
    },
  ],
});

studentSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('Student', studentSchema);
