const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

// --- Load Environment Variables FIRST ---
dotenv.config();

// --- Import other files AFTER env variables are loaded ---
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes'); // <-- IMPORT THIS
require('./config/passport-setup'); 

const app = express();

// --- Middleware ---
const allowedOrigins = [
  'http://localhost:5174',
  'https://assistant-ai-chat-voice.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};
connectDB();

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes); // <-- THE MISSING LINE

// Root route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
