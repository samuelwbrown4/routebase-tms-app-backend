const {getAllCarriersService , editCarrierService , addCarrierService} = require('../services/carriers.service')

const getAllCarriers = async (req , res) => {
    try{
        const carriers =  await getAllCarriersService()
        res.status(200).json({carriers})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const editCarrier = async (req , res) => {
    try{
        const {carrierId} = req.params
        const {payload} = req.body
        if(payload.name.length === 0){
            payload.name = null
        }
        if(payload.scac.length === 0){
            payload.scac = null
        }
        if(payload.address.length ===0){
            payload.address = null
        }
        let editedCarrier = await editCarrierService(carrierId , payload);
        res.status(200).json({editedCarrier})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const addCarrier = async (req , res) => {
    try{
        const {payload} = req.body
        const newCarrier = await addCarrierService
        res.status(201).json({newCarrier})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getAllCarriers , editCarrier , addCarrier}