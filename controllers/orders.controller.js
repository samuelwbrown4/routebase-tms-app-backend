const {getAllOrdersService , getOrderLineItemsService , getOrdersByStatusService} = require('../services/orders.service.js')
const {getShipperLocationIdService} = require('../services/shippers.service.js')

const getAllOrders = async (req , res) => {
    try{
        const orders = await getAllOrdersService();
        res.status(200).json({orders: orders})
    }catch(err) {
        res.status(500).json({ error: err.message })
    }
}

const getOrderLineItems = async (req , res) => {
    try{
        const {orderId} = req.params
        const lineItems = await getOrderLineItemsService(orderId)

        res.status(200).json({lineItems})
    }catch(err) {
        res.status(500).json({ error: err.message })
    }
}

const getOrdersByStatus = async (req , res) => {
    try{
        const {id} = req.params;
        const {status} = req.query;
        const shipperLocation = await getShipperLocationIdService(id)
        const orders = await getOrdersByStatusService(status , shipperLocation);

        res.status(200).json({orders})

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {getAllOrders , getOrderLineItems , getOrdersByStatus}