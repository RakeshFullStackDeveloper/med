const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
require('dotenv').config();

const router = express.Router();

// Signup
router.post('/signup', (req, res) => {
  const { username, password, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  db.run(query, [username, hashedPassword, role], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ?`;
  db.get(query, [username], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
});

module.exports = router;