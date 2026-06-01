const {getAllCarriers , getCarrierIdByUser , editCarrier , newCarrier} =  require('../repos/carriers.repo')

const getAllCarriersService = async () => {
    const carriers = await getAllCarriers();
    return carriers;
}

const getCarrierIdByUserService = async (id) => {
    const carrierId = await getCarrierIdByUser(id);

    return carrierId;
}

const editCarrierService = async (carrierId , payload) => {
    const editedCarrier = await editCarrier(carrierId , payload);
    return editedCarrier
}

const addCarrierService = async (payload) => {
    const newCarrier = await editCarrier(payload);
    return newCarrier
}

module.exports = {getAllCarriersService , getCarrierIdByUserService , editCarrierService , addCarrierService}