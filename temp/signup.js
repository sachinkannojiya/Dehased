const express = require('express');
const router = express.Router();
const User = require('./user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => {
   try {
    let { fullName, email, password } = req.body;
    fullName = fullName.trim();
    email = email.trim();
    password = password.trim();

    if (!(fullName || email || password)) {
      return res.status(400).json({ message: 'Empty Input Fields' });
    } else if (!/^[a-zA-Z]+$/.test(fullName)) {
      return res.status(400).json({ message: 'Invalid name entered' });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email entered' });
    } else if (password.length < 8) {
      return res.status(400).json({ message: 'Password is too short' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ fullName, email, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(200).json({ message: 'Signup Success', data: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    

    if (!email || !password) {
      return res.status(400).json({ message: 'Empty Input Fields' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare passwords
    console.log('Password:', password);
    console.log('Hashed Password:', user.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', passwordMatch);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Signin successful
    res.status(200).json({ message: 'Signin successful', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

