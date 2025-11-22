const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, phone_number, password, location, role } = req.body;

    const newUser = await User.create({ name, phone_number, password, location, role });
    
    res.status(201).json({ 
        message: "User registered successfully", 
        user: newUser 
    });

  } catch (err) {
    console.error("Error in register route:", err.message);
    res.status(500).send('Server Error');
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    // Checking if user exists
    const user = await User.findByPhone(phone_number);
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Comparing the password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT Token
    const payload = {
        user: {
            id: user.id,
            role: user.role
        }
    };

    jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' },
        (err, token) => {
            if (err) throw err;
            res.json({ 
                message: "Login successful",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role
                }
            });
        }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;