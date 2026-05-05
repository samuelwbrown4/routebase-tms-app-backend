const {getCarrierConversations , getShipperConversations , createConversation , createMessage , checkExistingConversation} = require('../repos/conversations.repo');

const getCarrierConversationsService = async (id) => {
    const conversations = getCarrierConversations(id);

    return conversations;
}

const getShipperConversationsService = async (id) => {
    const conversations = getShipperConversations(id);

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

module.exports = {getCarrierConversationsService , getShipperConversationsService , createConversationService , createMessageService , checkExistingConversationService}