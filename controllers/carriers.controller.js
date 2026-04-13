const {getAllCarriersService} = require('../services/carriers.service')

const getAllCarriers = async (req , res) => {
    try{
        const carriers =  await getAllCarriersService()
        res.status(200).json({carriers})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getAllCarriers}