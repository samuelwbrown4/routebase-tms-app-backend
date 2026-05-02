const {getAllOrders , getOrderLineItems , getOrdersByStatus} = require('../repos/orders.repo.js')

const getAllOrdersService = async (id) =>{
    const orders = await getAllOrders(id);

    return orders;
}

const getOrderLineItemsService = async (orderId) => {
    const lineItems = await getOrderLineItems(orderId)

    return lineItems;
}

const getOrdersByStatusService = async (status , shipperLocation) => {
    const orders = await getOrdersByStatus(status , shipperLocation);

    return orders
}

module.exports = {getAllOrdersService , getOrderLineItemsService , getOrdersByStatusService}