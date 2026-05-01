const {getCompanyIdService , getShipperLocationIdService , getAllShipperLocationsByCompanyIdService , getShipmentsByShipperLocationService} = require('../services/shippers.service');

const getCompanyId = async (req , res) => {
    try{
        const {id} = req.params;

        const companyId = await getCompanyIdService(id);
        res.status(200).json({companyId})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const getShipperLocationId = async(req , res) => {
    try{
        const {id} = req.params;

        const shipperLocationId = await getShipperLocationIdService(id)
        res.status(200).json({shipperLocationId})
    } catch(err){
        res.status(500).json({error: err.message})
    }
}

const getAllShipperLocationsByCompanyId = async (req , res) => {
    try{

        const {id} = req.params;
        const companyId = await getCompanyIdService(id)

        const locations = await getAllShipperLocationsByCompanyIdService(companyId);
        res.status(200).json({locations})
    } catch(err){
        res.status(500).json({error: err.message})
    }
}

const getShipmentsByShipperLocation = async (req , res) => {
    try{
        const { id } = req.params;
        const {status} = req.query;
        let shipperLocationId = await getShipperLocationIdService(id)
        let statusArray = status.split(',');
        let shipments = await getShipmentsByShipperLocationService(shipperLocationId , statusArray);
        res.status(200).json({shipments})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getCompanyId , getShipperLocationId , getAllShipperLocationsByCompanyId , getShipmentsByShipperLocation}