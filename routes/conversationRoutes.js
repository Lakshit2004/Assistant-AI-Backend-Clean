    const express = require('express');
    const router = express.Router();
    const { getConversations, getConversationById, addMessageToConversation } = require('../controllers/conversationController');
    const { protect } = require('../utils/authMiddleware');

    // GET all conversation titles for the sidebar & POST a new message
    router.route('/').get(protect, getConversations).post(protect, addMessageToConversation);

    // GET a single, full conversation by its ID
    router.route('/:id').get(protect, getConversationById);

    module.exports = router;
    