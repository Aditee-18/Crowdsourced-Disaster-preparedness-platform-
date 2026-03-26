require('dotenv').config();
const express = require('express');

const cors = require('cors'); 
const app = express();

const AlertModel = require('./models/Alert');
AlertModel.createAlertTable();

const resourceRoutes = require('./routes/Resource');
const commentRoutes = require('./routes/comment');
const alertRoutes = require('./routes/alerts');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/alerts', alertRoutes);

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

app.use('/api/resources', resourceRoutes);

app.use('/api/comments', commentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});