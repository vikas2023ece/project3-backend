const express = require('express');
const bcrypt = require('bcrypt');
const Faculty = require('../models/Faculty');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, dob, password, mobileNumber } = req.body;

  if (!name || !email || !dob || !password || !mobileNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
   
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty account already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = new Faculty({ name, email, dob, password: hashedPassword, mobileNumber });
    await faculty.save();

    res.status(201).json({ message: 'Faculty account created successfully' });
  } catch (err) {
    console.error('Error creating faculty account:', err);
    res.status(500).json({ message: 'Failed to create faculty account', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;