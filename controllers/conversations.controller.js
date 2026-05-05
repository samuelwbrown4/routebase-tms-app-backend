const { getCarrierConversationsService, getShipperConversationsService, createConversationService, createMessageService, checkExistingConversationService } = require('../services/conversations.service')

const { getCompanyIdService, getCompanyIdByShipperLocService, getShipperLocationIdService } = require('../services/shippers.service')

const { getCarrierIdByUserService } = require('../services/carriers.service');
const { getShipmentByShipmentNumberService } = require('../services/shipments.service');

const getConversations = async (req, res) => {
    try {
        const { id, client } = req.user;

        let conversations = []

        if (client === 'carrier') {
            const carrierId = await getCarrierIdByUserService(id)
            conversations = await getCarrierConversationsService(carrierId)
        } else {
            const shipperLocId = await getShipperLocationIdService(id)
            conversations = await getShipperConversationsService(shipperLocId)
        }
        res.status(200).json({ conversations })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const createConversation = async (req, res) => {
    try {
        const { id, client } = req.user;
        const { text } = req.body;
        const { shipmentNumber } = req.query;
        
        const shipment = await getShipmentByShipmentNumberService(shipmentNumber)

        const carrierId = shipment.carrier_id
        const shipperLocId = shipment.origin_id;

        const shipperId = await getCompanyIdByShipperLocService(shipperLocId)

        const existing = await checkExistingConversationService(shipment.id)

        if (existing.rows[0]) {
            let message = await createMessageService(existing.rows[0].id, text, client)
            return res.status(201).json({ message })
        }

        let conversation = await createConversationService(shipment.id, carrierId, shipperId, shipperLocId, client, text);

        return res.status(201).json({ conversation })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const createMessage = async (req, res) => {
    try {
        const { id, role, client } = req.user
        const { conversationId } = req.query
        const { text } = req.body

        let message = await createMessageService(conversationId, text, client)
        res.status(201).json({ message })
    } catch (err) {
        res.send(500).json({ error: err.message })
    }
}

module.exports = { getConversations, createConversation, createMessage }