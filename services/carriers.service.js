const {getAllCarriers} =  require('../repos/carriers.repo')

const getAllCarriersService = async () => {
    const carriers = await getAllCarriers();

    return carriers;
}

module.exports = {getAllCarriersService}