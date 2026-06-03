const { getRatesByShipperUserService , getRateByCarrierService } = require('../services/rates.service');
const {getCompanyIdByShipperLocService, getShipperLocationIdService} = require('../services/shippers.service')

const getRatesByShipperUser = async (req, res) => {
    try {
        const { id } = req.user;
        const { distance } = req.body;

        const rates = await getRatesByShipperUserService(id, distance);
        res.status(200).json({ rates })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getRateByCarrier = async (req , res) => {
    try{
        const {id} = req.user;
        const {carrier} = req.params;
        const {distance} = req.body
        let shipperLocationId = await getShipperLocationIdService(id)
        let companyId = await getCompanyIdByShipperLocService(shipperLocationId)
        let rateDetails = await getRateByCarrierService(carrier , companyId , distance)
        res.status(200).json({rateDetails})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getRatesByShipperUser , getRateByCarrier};