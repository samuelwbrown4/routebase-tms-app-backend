const {getCarrierConversations , getShipperConversations , createConversation , createMessage , checkExistingConversation , readMessages } = require('../repos/conversations.repo');

const getCarrierConversationsService = async (id , statusArray , sender) => {
    const conversations = getCarrierConversations(id , statusArray , sender);

    return conversations;
}

const getShipperConversationsService = async (id , statusArray , sender) => {
    const conversations = getShipperConversations(id , statusArray , sender);

    return conversations;
}

const checkExistingConversationService = async (shipmentId) => {
    let existing = await checkExistingConversation(shipmentId);

    return existing
}

const createConversationService = async (shipmentId , carrierId , shipperId , shipperLocId , sender , text) => {
    const conversation = await createConversation(shipmentId , carrierId , shipperId , shipperLocId , sender , text)

    return conversation;
}

const createMessageService = async (conversationId , text , sender) => {
    const message = await createMessage(conversationId , text , sender);

    return message;
}

const readMessagesService = async (conversationId , sender) => {
    const updatedConvos = await readMessages(conversationId , sender)

    return updatedConvos;
}

module.exports = {getCarrierConversationsService , getShipperConversationsService , createConversationService , createMessageService , checkExistingConversationService , readMessagesService}