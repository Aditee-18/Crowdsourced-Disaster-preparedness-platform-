const express = require('express');
require('dotenv').config();
const cors = require('cors'); 
const app = express();
const resourceRoutes = require('./routes/Resource');
const commentRoutes = require('./routes/comment');
// Middleware
app.use(express.json())
app.use(cors());


// Routes
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

app.use('/api/resources', resourceRoutes);

app.use('/api/comments', commentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});