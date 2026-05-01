const {getCompanyId , getShipperLocationId , getAllShipperLocationsByCompanyId , getShipmentsByShipperLocation} = require('../repos/shippers.repo')

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

const getShipmentsByShipperLocationService = async (id , status) => {
    const shipments = await getShipmentsByShipperLocation(id , status)

    return shipments
}

module.exports = {getCompanyIdService , getShipperLocationIdService , getAllShipperLocationsByCompanyIdService , getShipmentsByShipperLocationService}