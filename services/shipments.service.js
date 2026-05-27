const {createShipment , getUndeliveredShipments , getShipmentsByCarrierId , updateShipment , getShipmentCoordsById , getShipmentById , getCarrierShipmentByShipmentNumber , getShipperShipmentByShipmentNumber , getShipmentByShipmentNumber , shipmentSearch , carrierGetSpotShipments , makeSpotOffer , acceptSpotOffer , resetBidDeadline} = require('../repos/shipments.repo')

const createShipmentService = async (originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId,  orders, distance , rate , shipmentStatus , bidDeadline) => {
    const shipment = await createShipment(originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders, distance , rate , shipmentStatus , bidDeadline);

    if (shipment.bid_deadline) {
    shipment.bid_deadline = new Date(shipment.bid_deadline).toISOString()
}

    return shipment;
};

const getUndeliveredShipmentsService = async (status) => {
    const undeliveredShipments = await getUndeliveredShipments(status);

    return undeliveredShipments
}

const getShipmentsByCarrierIdService = async (userId , status ) => {
    if(status.length === 1 && status[0] === 'pending_carrier'){
        let shipments = await carrierGetSpotShipments(status)
        shipments = shipments.map(shipment => {
            if (shipment.bid_deadline) {
                shipment.bid_deadline = new Date(shipment.bid_deadline).toISOString()
            }
            return shipment
        })
        return shipments
    }

    let shipments = await getShipmentsByCarrierId(userId , status );
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

const makeSpotOfferService = async (carrierId , shipmentId , rate) => {
    const bid = await makeSpotOffer(carrierId , shipmentId , rate);

    return bid
}

const acceptSpotOfferService = async (offerId , shipmentId) => {
    const acceptedShipment = await acceptSpotOffer(offerId , shipmentId)

    return acceptedShipment
}

const resetBidDeadlineService = async (shipmentId , bidDeadline) => {
    let updatedShipment = await resetBidDeadline(shipmentId , bidDeadline);

    return updatedShipment;
}

module.exports = {createShipmentService , getUndeliveredShipmentsService , getShipmentsByCarrierIdService , updateShipmentService , getShipmentCoordsByIdService , getShipmentByIdService , getCarrierShipmentByShipmentNumberService , getShipperShipmentByShipmentNumberService , getShipmentByShipmentNumberService , shipmentSearchService , makeSpotOfferService , acceptSpotOfferService , resetBidDeadlineService}