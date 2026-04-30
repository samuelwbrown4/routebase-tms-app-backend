const {getCustomerLocationsByCompanyId , createCustomerLocation} = require('../repos/customerLocations.repo');

const getCustomerLocationsByCompanyIdService = async (id) => {
    const customerLocations = await getCustomerLocationsByCompanyId(id)

    return customerLocations;
}

const createCustomerLocationService = async (customerId , name , address , city , state , zip , country , lat , long) => {
    const newCustomerLocation = await createCustomerLocation(customerId , name , address , city , state , zip , country , lat , long)

    return newCustomerLocation
}

module.exports = {getCustomerLocationsByCompanyIdService , createCustomerLocationService}