const {getCompanyId , getShipperLocationId} = require('../repos/shippers.repo')

const getCompanyIdService = async (id) => {
    let companyId = getCompanyId(id);

    return companyId;
}

const getShipperLocationIdService = async (id) => {
    const shipperLocationId = await getShipperLocationId(id);

    return shipperLocationId;
}

module.exports = {getCompanyIdService , getShipperLocationIdService}