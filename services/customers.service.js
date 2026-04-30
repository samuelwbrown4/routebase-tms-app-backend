const {getCustomersByCompanyId , createCustomer} = require('../repos/customers.repo');

const getCustomersByCompanyIdService = async (id) => {
    const companies = await getCustomersByCompanyId(id);

    return companies;
}

const createCustomerService = async (companyId , name , address , city , state , zip , country) => {
    let newCustomer = await createCustomer(companyId , name , address , city , state , zip , country)

    return newCustomer.rows[0]
}

module.exports = {getCustomersByCompanyIdService , createCustomerService}