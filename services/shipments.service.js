const {createShipment , getUndeliveredShipments , getShipmentsByCarrierId , updateShipment} = require('../repos/shipments.repo')

const createShipmentService = async (originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId,  orders) => {
    await createShipment(originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders)
};

const getUndeliveredShipmentsService = async () => {
    const undeliveredShipments = await getUndeliveredShipments();

    return undeliveredShipments
}

const getShipmentsByCarrierIdService = async (userId) => {
    const shipments = await getShipmentsByCarrierId(userId);

    return shipments
}

const updateShipmentService = async (shipmentId , date , userId , eventType) => {
    await updateShipment(shipmentId , date , userId , eventType)
}

module.exports = {createShipmentService , getUndeliveredShipmentsService , getShipmentsByCarrierIdService , updateShipmentService}