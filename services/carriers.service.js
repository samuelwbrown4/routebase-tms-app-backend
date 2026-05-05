const {getAllCarriers , getCarrierIdByUser} =  require('../repos/carriers.repo')

const getAllCarriersService = async () => {
    const carriers = await getAllCarriers();
    return carriers;
}

const getCarrierIdByUserService = async (id) => {
    const carrierId = await getCarrierIdByUser(id);

    return carrierId;
}

module.exports = {getAllCarriersService , getCarrierIdByUserService}