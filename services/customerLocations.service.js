const {getCustomerLocationsByCompanyId , createCustomerLocation} = require('../repos/customerLocations.repo');

const getCustomerLocationsByCompanyIdService = async (id) => {
    const customerLocations = await getCustomerLocationsByCompanyId(id)

    return customerLocations;
}

const createCustomerLocationService = async (payload) => {
    const newCustomerLocation = await createCustomerLocation(payload)

    return newCustomerLocation
}

module.exports = {getCustomerLocationsByCompanyIdService , createCustomerLocationService}