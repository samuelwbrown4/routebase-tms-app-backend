const express = require('express');
const router = express.Router();

const {getConversations} = require('../controllers/conversations.controller');
const { createConversation } = require('../controllers/conversations.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/conversations' , requireAuth , getConversations);
router.post('/conversations' , requireAuth , createConversation)

module.exports = router;