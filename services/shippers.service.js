const { getCompanyId, getShipperLocationId, getAllShipperLocationsByCompanyId, getShipmentsByShipperLocation, getCompanyIdByShipperLoc, getSpotLoadsByShipperLocation } = require('../repos/shippers.repo')

const getCompanyIdService = async (id) => {
    let companyId = await getCompanyId(id);

    return companyId;
}

const getShipperLocationIdService = async (id) => {
    const shipperLocationId = await getShipperLocationId(id);

    return shipperLocationId;
}

const getAllShipperLocationsByCompanyIdService = async (id) => {
    const locations = await getAllShipperLocationsByCompanyId(id);

    return locations
}

const getShipmentsByShipperLocationService = async (id, status) => {

    if (status.length === 1 && status[0] === 'pending_carrier') {

        let shipments = await getSpotLoadsByShipperLocation(id, status)
        shipments = shipments.map(shipment => {
            if (shipment.bid_deadline) {
                shipment.bid_deadline = new Date(shipment.bid_deadline).toISOString()
            }
            return shipment
        })

        return shipments
    }

    let shipments = await getShipmentsByShipperLocation(id, status)
    return shipments
}

const getCompanyIdByShipperLocService = async (id) => {
    const companyId = await getCompanyIdByShipperLoc(id);

    return companyId
}

module.exports = { getCompanyIdService, getShipperLocationIdService, getAllShipperLocationsByCompanyIdService, getShipmentsByShipperLocationService, getCompanyIdByShipperLocService }