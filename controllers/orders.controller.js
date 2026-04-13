const {getAllOrdersService , getOrderLineItemsService} = require('../services/orders.service.js')

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

module.exports = {getAllOrders , getOrderLineItems}