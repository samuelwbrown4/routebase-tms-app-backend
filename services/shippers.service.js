const {getCompanyId , getShipperLocationId , getAllShipperLocationsByCompanyId} = require('../repos/shippers.repo')

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

module.exports = {getCompanyIdService , getShipperLocationIdService , getAllShipperLocationsByCompanyIdService}