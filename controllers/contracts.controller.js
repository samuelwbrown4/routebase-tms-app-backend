const { createContractService , getContractsByShipperUserService } = require('../services/contracts.service')


const createContract = async (req , res) => {
    try{
        const {shipperId , carrierId , packageId , startDate , endDate} = req.body;
        const contract = await createContractService(shipperId , carrierId , packageId , startDate , endDate);

        res.status(201).json({contract: contract})
    }catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getContractsByShipperUser = async (req , res) =>{
    try{
        const {id} = req.params;
        const contracts = await getContractsByShipperUserService(id)
        res.status(200).json({contracts})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
    

module.exports = {createContract , getContractsByShipperUser}