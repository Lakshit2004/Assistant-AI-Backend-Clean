const mongoose = require('mongoose');

// This defines the structure for a single message within a conversation
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'bot'], // Message can only be from 'user' or 'bot'
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema({
  // This creates a reference to a User document
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The 'ref' tells Mongoose which model to use during population
    required: true,
  },
  messages: [messageSchema], // An array of message documents
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;