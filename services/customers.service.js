const {getCustomersByCompanyId , createCustomer} = require('../repos/customers.repo');

const getCustomersByCompanyIdService = async (id) => {
    const companies = await getCustomersByCompanyId(id);

    return companies;
}

const createCustomerService = async (payload) => {
    let newCustomer = await createCustomer(payload)

    return newCustomer
}

module.exports = {getCustomersByCompanyIdService , createCustomerService}