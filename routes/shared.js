const express = require('express');
const router = express.Router();

const {getConversations} = require('../controllers/conversations.controller');
const { createConversation , createMessage , readMessages} = require('../controllers/conversations.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/conversations' , requireAuth , getConversations);
router.post('/conversations' , requireAuth , createConversation);
router.post('/conversations/messages' , requireAuth , createMessage)
/*router.get('/conversations/messages' , requireAuth , getMessages)*/
router.patch('/conversations/messages/:conversationId' , requireAuth , readMessages)

module.exports = router;