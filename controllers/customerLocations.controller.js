const {getCustomerLocationsByCompanyIdService} = require('../services/customerLocations.service');
const {getCompanyIdService} = require('../services/shippers.service')

const getCustomerLocationsByCompanyId = async (req , res) => {
    try{
        let {userId} = req.params;
        let companyId = await getCompanyIdService(userId)
        let customerLocations = await getCustomerLocationsByCompanyIdService(companyId);

        res.status(200).json({customerLocations})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getCustomerLocationsByCompanyId}