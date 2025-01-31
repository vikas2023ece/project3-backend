const express = require("express");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");

const router = express.Router();

// Add Student
router.post("/", async (req, res) => {
  const { name, phoneNumber, fatherName, fatherPhoneNumber, department, year, email, password } = req.body;

  if (!name || !phoneNumber || !fatherName || !fatherPhoneNumber || !department || !year || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const studentId = `SID${Math.floor(Math.random() * 1000000)}`;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      studentId,
      name,
      phoneNumber,
      fatherName,
      fatherPhoneNumber,
      department,
      year,
      email,
      password: hashedPassword,
    });

    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Error saving student:", err);
    res.status(400).json({ message: err.message });
  }
});


// Route to get students by class it is used to view attendance
router.get('/class/:class', async (req, res) => {
  try {
    const students = await Student.find({ department: req.params.class });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

// Route to update attendance for a student
router.patch('/:studentId/attendance', async (req, res) => {
  const { studentId } = req.params;
  const { date, period, status } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendanceRecord = student.attendance.find(record => record.date === date && record.period === period);
    if (attendanceRecord) {
      attendanceRecord.status = status;
    } else {
      student.attendance.push({ date, period, status });
    }

    if (status === 'Present') {
      student.presentPeriods += 1;
    } else if (status === 'Absent') {
      student.absentPeriods += 1;
    } else if (status === 'OD') {
      student.odPeriods += 1;
    }

    await student.save();
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance', error });
  }
});

// Route to get a student by ID
router.get('/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error });
  }
});

// Route to update a student
router.put('/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { name, phoneNumber, fatherName, fatherPhoneNumber, department, year, email, password } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.name = name;
    student.phoneNumber = phoneNumber;
    student.fatherName = fatherName;
    student.fatherPhoneNumber = fatherPhoneNumber;
    student.department = department;
    student.year = year;
    student.email = email;
    if (password) {
      student.password = password;
    }

    await student.save();
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
});

// Route to get attendance for a student by date
router.get('/:studentId/attendance', async (req, res) => {
  const { studentId } = req.params;
  const { date } = req.query;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendance = student.attendance.filter(record => record.date === date);
    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
});

// Route to update attendance for a student
router.patch('/:studentId/attendance', async (req, res) => {
  const { studentId } = req.params;
  const { date, period, status } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendanceRecord = student.attendance.find(record => record.date === date && record.period === period);
    if (attendanceRecord) {
      attendanceRecord.status = status;
    } else {
      student.attendance.push({ date, period, status });
    }

    if (status === 'Present') {
      student.presentPeriods += 1;
    } else if (status === 'Absent') {
      student.absentPeriods += 1;
    } else if (status === 'OD') {
      student.odPeriods += 1;
    }

    await student.save();
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance', error });
  }
});

// Route to get attendance for students by class
router.get('/class/:class/attendance', async (req, res) => {
  try {
    const students = await Student.find({ department: req.params.class });
    const attendanceData = students.map(student => ({
      studentId: student.studentId,
      attendance: student.attendance,
    }));
    res.json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
});

module.exports = router;
