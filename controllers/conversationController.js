const Conversation = require('../models/conversationModel');
const User = require('../models/userModel');

// @desc    Get all conversations for a user (titles/IDs only)
// @route   GET /api/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    console.log(`Fetching conversations for user: ${req.user._id}`); // Logging added
    const conversations = await Conversation.find({ userId: req.user._id }).sort({ updatedAt: -1 }).select('_id messages');
    
    const conversationList = conversations.map(convo => {
      // Defensive check to prevent errors on empty or malformed conversations
      if (!convo || !convo.messages || convo.messages.length === 0) {
        return {
          _id: convo._id,
          title: 'Empty Chat'
        };
      }
      return {
        _id: convo._id,
        // Also check if the first message actually has text
        title: convo.messages[0].text ? convo.messages[0].text.substring(0, 40) + '...' : 'Chat'
      };
    });

    res.json(conversationList);
  } catch (error) {
    console.error("Error in getConversations:", error); // Logging added
    res.status(500).json({ message: 'Server error fetching conversations' });
  }
};

// @desc    Get a single conversation by ID
// @route   GET /api/conversations/:id
// @access  Private
const getConversationById = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user._id });
        if (conversation) {
            res.json(conversation);
        } else {
            res.status(404).json({ message: 'Conversation not found' });
        }
    } catch (error) {
        console.error("Error in getConversationById:", error); // Logging added
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a message to a conversation
// @route   POST /api/conversations
// @access  Private
const addMessageToConversation = async (req, res) => {
  const { conversationId, message } = req.body;
  
  try {
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = new Conversation({ userId: req.user._id, messages: [] });
    }
    
    conversation.messages.push(message);
    await conversation.save();
    
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Server error saving message' });
  }
};

module.exports = { getConversations, getConversationById, addMessageToConversation };
