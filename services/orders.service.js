const {getAllOrders , getOrderLineItems , getOrdersByStatus , createOrder , getOrdersByDateRange} = require('../repos/orders.repo.js')

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

const createOrderService = async (payload) => {
    let order = await createOrder(payload)

    return order;
}

const getOrdersByDateRangeService = async (id) => {
    const orders = await getOrdersByDateRange(id)

    return orders;
}

module.exports = {getAllOrdersService , getOrderLineItemsService , getOrdersByStatusService , createOrderService , getOrdersByDateRangeService}