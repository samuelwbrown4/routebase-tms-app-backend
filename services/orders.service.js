const {getAllOrders , getOrderLineItems} = require('../repos/orders.repo.js')

const getAllOrdersService = async () =>{
    const orders = await getAllOrders();

    return orders;
}

const getOrderLineItemsService = async (orderId) => {
    const lineItems = await getOrderLineItems(orderId)

    return lineItems;
}

module.exports = {getAllOrdersService , getOrderLineItemsService}