const {getCustomersByCompanyIdService} = require('../services/customers.service');
const {getCompanyIdService} = require('../services/shippers.service')

const getCustomersByCompanyId = async (req , res) => {
    try{
        const {userId} = req.params;
        let companyId = await getCompanyIdService(userId);
        let customers = await getCustomersByCompanyIdService(companyId);
        res.status(200).json({customers})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getCustomersByCompanyId}