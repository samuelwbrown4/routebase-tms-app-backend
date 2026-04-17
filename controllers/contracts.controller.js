const { createContractService , getContractsByShipperUserService } = require('../services/contracts.service')


const createContract = async (req , res) => {
    try{
        const {carrierUserId} = req.params
        const {shipperId , packageId , startDate , endDate} = req.body;
        const contract = await createContractService(shipperId , carrierUserId , packageId , startDate , endDate);

        res.status(201).json({contract: contract})
    }catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getContractsByShipperUser = async (req , res) =>{
    try{
        const {id} = req.params;
        const {status} = req.query
        const contracts = await getContractsByShipperUserService(id , status)
        res.status(200).json({contracts})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
    

module.exports = {createContract , getContractsByShipperUser}