// backend/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const passport = require('./config/passport'); // Import the passport configuration
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoute = require('./routes/contact')

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Static folder for profile photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });



// Routes
app.use('/api', authRoutes);
app.use('/api', serviceRoutes);
app.use('/api', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoute);
app.use('/auth', require('./routes/auth')); 


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB atlas');
    // Start the server
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
