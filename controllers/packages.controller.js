const { getPkgsByCarrierUserService , createPkgByCarrierUserService} = require('../services/packages.service');

const getPkgsByCarrierUser = async (req, res) => {
    try {
        const { id } = req.params;
        const packages = await getPkgsByCarrierUserService(id)
        res.status(200).json({ packages })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const createPkgByCarrierUser = async (req , res) => {
    try{
        const {id} = req.params
        const {name , minDistance1 , maxDistance1 , flatRate1 , perMileRate1 , fuelSurcharge1 , minDistance2 , maxDistance2 , flatRate2 , perMileRate2 , fuelSurcharge2 , minDistance3 , maxDistance3 , flatRate3 , perMileRate3 , fuelSurcharge3 , minDistance4 ,  flatRate4 , perMileRate4 , fuelSurcharge4} = req.body

        await createPkgByCarrierUserService(id , name , minDistance1 , maxDistance1 , flatRate1 , perMileRate1 , fuelSurcharge1 , minDistance2 , maxDistance2 , flatRate2 , perMileRate2 , fuelSurcharge2 , minDistance3 , maxDistance3 , flatRate3 , perMileRate3 , fuelSurcharge3 , minDistance4 ,  flatRate4 , perMileRate4 , fuelSurcharge4)

        res.status(200).json({message: 'Successfully created new package'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getPkgsByCarrierUser , createPkgByCarrierUser}