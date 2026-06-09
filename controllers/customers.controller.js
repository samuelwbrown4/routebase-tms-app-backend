const {getCustomersByCompanyIdService , createCustomerService} = require('../services/customers.service');
const {getCompanyIdService} = require('../services/shippers.service')

const getCustomersByCompanyId = async (req , res) => {
    try{
        const {id} = req.user;
        let companyId = await getCompanyIdService(id);
        let customers = await getCustomersByCompanyIdService(companyId);
        res.status(200).json({customers})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const createCustomer = async (req , res) => {
    try{
        console.log('create customer hit')
        const companyId = req.companyId
        const {payload} = req.body
        payload.companyId = companyId
        console.log('cust payload' , payload)
        const newCustomer = await createCustomerService(payload)
        console.log('customer query result' , newCustomer)
        res.status(201).json({newCustomer})
    }catch(err){
        res.status(500).json({error: err.message})
    }

}

module.exports = {getCustomersByCompanyId, createCustomer}