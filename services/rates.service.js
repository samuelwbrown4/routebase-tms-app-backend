const {getRatesByShipperUser} = require('../repos/rates.repo');

const getRatesByShipperUserService = async (id , distance) => {
    const rates = await getRatesByShipperUser(id , distance);

    return rates;
};

module.exports = {getRatesByShipperUserService};