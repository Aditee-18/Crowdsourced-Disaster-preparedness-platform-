const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// ROUTE 1: Get everything for the Map
// GET http://localhost:5000/api/resources?type=hospital&search=city
router.get('/', async (req, res) => {
  try {
    // req.query holds the URL data: { type: 'hospital', search: 'city' }
    const resources = await Resource.findAll(req.query);
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ROUTE 2: Add a new Pin
// Frontend calls: POST http://localhost:5000/api/resources
router.post('/', async (req, res) => {
  try {
    // req.body contains the data the user filled in the form
    const newResource = await Resource.create(req.body);
    res.status(201).json(newResource);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;