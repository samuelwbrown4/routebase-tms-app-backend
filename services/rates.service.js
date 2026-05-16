const {getRatesByShipperUser , getRateByCarrier} = require('../repos/rates.repo');

const getRatesByShipperUserService = async (id , distance) => {
    const rates = await getRatesByShipperUser(id , distance);

    return rates;
};

const getRateByCarrierService = async (carrier , companyId , distance) => {
    const rateDetails = await getRateByCarrier(carrier , companyId ,  distance);

    return rateDetails
}

module.exports = {getRatesByShipperUserService , getRateByCarrierService};