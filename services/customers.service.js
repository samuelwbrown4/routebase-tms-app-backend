const {getCustomersByCompanyId} = require('../repos/customers.repo');

const getCustomersByCompanyIdService = async (id) => {
    const companies = await getCustomersByCompanyId(id);

    return companies;
}

module.exports = {getCustomersByCompanyIdService}