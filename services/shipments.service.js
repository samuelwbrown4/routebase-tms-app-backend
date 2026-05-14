const {createShipment , getUndeliveredShipments , getShipmentsByCarrierId , updateShipment , getShipmentCoordsById , getShipmentById , getCarrierShipmentByShipmentNumber , getShipperShipmentByShipmentNumber , getShipmentByShipmentNumber , shipmentSearch} = require('../repos/shipments.repo')

const createShipmentService = async (originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId,  orders, distance) => {
    const shipment = await createShipment(originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders, distance);

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

const getCarrierShipmentByShipmentNumberService = async (shipmentNumber , id) => {
    let shipment = getCarrierShipmentByShipmentNumber(shipmentNumber , id);

    return shipment
}

const getShipperShipmentByShipmentNumberService = async (shipmentNumber , id) => {
    let shipment = getShipperShipmentByShipmentNumber(shipmentNumber , id);

    return shipment
}

const getShipmentByShipmentNumberService = async (shipmentNumber) => {
    let shipment = getShipmentByShipmentNumber(shipmentNumber);

    return shipment
}

const shipmentSearchService = async (id , searchValue) => {
    let shipments = await shipmentSearch(id , searchValue);

    return shipments;
}

module.exports = {createShipmentService , getUndeliveredShipmentsService , getShipmentsByCarrierIdService , updateShipmentService , getShipmentCoordsByIdService , getShipmentByIdService , getCarrierShipmentByShipmentNumberService , getShipperShipmentByShipmentNumberService , getShipmentByShipmentNumberService , shipmentSearchService}