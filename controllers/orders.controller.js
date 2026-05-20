const {getAllOrdersService , getOrderLineItemsService , getOrdersByStatusService , createOrderService} = require('../services/orders.service.js')
const {getShipperLocationIdService} = require('../services/shippers.service.js')

const getAllOrders = async (req , res) => {
    try{
        const {userId} = req.params;
        const locId = await getShipperLocationIdService(userId)
        const orders = await getAllOrdersService(locId);
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
        const {id} = req.user;
        const {status} = req.query;
        const shipperLocation = await getShipperLocationIdService(id)
        const orders = await getOrdersByStatusService(status , shipperLocation);

        res.status(200).json({orders})

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const createOrder = async (req , res) => {
    try{
        console.log('order controller hit')
        const companyId = req.companyId
        const {payload} = req.body
        console.log('companyId' ,companyId)

        payload.orderWeight = 0;
        payload.lineItems.forEach(li=> {payload.orderWeight += li.weight})

        let newOrder = await createOrderService(payload)
        res.status(201).json({message: 'success'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getAllOrders , getOrderLineItems , getOrdersByStatus , createOrder}