const {getPkgsByCarrierUser , createPkgByCarrierUser} = require('../repos/packages.repo');

const getPkgsByCarrierUserService = async(id) => {
    const packages = await getPkgsByCarrierUser(id);

    return packages;
}

const createPkgByCarrierUserService = async (id , name , minDistance1 , maxDistance1 , flatRate1 , perMileRate1 , fuelSurcharge1 , minDistance2 , maxDistance2 , flatRate2 , perMileRate2 , fuelSurcharge2 , minDistance3 , maxDistance3 , flatRate3 , perMileRate3 , fuelSurcharge3 , minDistance4 ,  flatRate4 , perMileRate4 , fuelSurcharge4) => {

    await createPkgByCarrierUser(id , name , minDistance1 , maxDistance1 , flatRate1 , perMileRate1 , fuelSurcharge1 , minDistance2 , maxDistance2 , flatRate2 , perMileRate2 , fuelSurcharge2 , minDistance3 , maxDistance3 , flatRate3 , perMileRate3 , fuelSurcharge3 , minDistance4 ,  flatRate4 , perMileRate4 , fuelSurcharge4)

}

module.exports = {getPkgsByCarrierUserService , createPkgByCarrierUserService}