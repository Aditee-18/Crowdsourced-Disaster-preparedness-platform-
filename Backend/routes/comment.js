const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// POST http://localhost:5000/api/comments
// Body: { "user_id": 1, "resource_id": 5, "text": "This shelter is clean."}
router.post('/', async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET http://localhost:5000/api/comments/resource/5
// Getsall comments for Resource #5
router.get('/resource/:id', async (req, res) => {
  try {
    const comments = await Comment.findByResourceId(req.params.id);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;