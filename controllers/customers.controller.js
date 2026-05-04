const {getCustomersByCompanyIdService} = require('../services/customers.service');
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

module.exports = {getCustomersByCompanyId}