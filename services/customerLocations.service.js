const {getCustomerLocationsByCompanyId} = require('../repos/customerLocations.repo');

const getCustomerLocationsByCompanyIdService = async (id) => {
    const customerLocations = await getCustomerLocationsByCompanyId(id)

    return customerLocations;
}

module.exports = {getCustomerLocationsByCompanyIdService}