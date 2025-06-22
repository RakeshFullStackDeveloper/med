const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');

// Add medication
router.post('/', verifyToken, (req, res) => {
  const { name, dosage, frequency } = req.body;
  const userId = req.user.id;

  const query = `INSERT INTO medications (user_id, name, dosage, frequency) VALUES (?, ?, ?, ?)`;
  db.run(query, [userId, name, dosage, frequency], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to add medication' });
    res.status(201).json({ message: 'Medication added', id: this.lastID });
  });
});

// Get all medications for user
router.get('/', verifyToken, (req, res) => {
  const userId = req.user.id;
  const query = `SELECT * FROM medications WHERE user_id = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch medications' });
    res.json(rows);
  });
});

// Mark medication as taken for today
router.put('/:id/take', verifyToken, (req, res) => {
  const medId = req.params.id;
  const query = `UPDATE medications SET taken_today = 1 WHERE id = ?`;

  db.run(query, [medId], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to update' });
    res.json({ message: 'Medication marked as taken' });
  });
});

// Get all medications with user info (Caretaker only)
router.get('/all', verifyToken, (req, res) => {
  if (req.user.role !== 'caretaker') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const query = `
    SELECT medications.*, users.username 
    FROM medications 
    JOIN users ON medications.user_id = users.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

module.exports = router;