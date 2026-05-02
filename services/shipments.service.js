const {createShipment , getUndeliveredShipments , getShipmentsByCarrierId , updateShipment , getShipmentCoordsById , getShipmentById} = require('../repos/shipments.repo')

const createShipmentService = async (originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId,  orders) => {
    const shipment = await createShipment(originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders);

    return shipment;
};

const getUndeliveredShipmentsService = async (status) => {
    const undeliveredShipments = await getUndeliveredShipments(status);

    return undeliveredShipments
}

const getShipmentsByCarrierIdService = async (userId , status ) => {
    const shipments = await getShipmentsByCarrierId(userId , status );

    return shipments
}

const updateShipmentService = async (shipmentId , date , userId , eventType , routeGeometry , driveTime) => {
    await updateShipment(shipmentId , date , userId , eventType , routeGeometry , driveTime)
}

const getShipmentCoordsByIdService = async (id) => {
    let coords = await getShipmentCoordsById(id)
    return coords
}

const getShipmentByIdService = async (id) => {
    let shipment = await getShipmentById(id);
    return shipment
}

module.exports = {createShipmentService , getUndeliveredShipmentsService , getShipmentsByCarrierIdService , updateShipmentService , getShipmentCoordsByIdService , getShipmentByIdService}