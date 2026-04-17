const { getCarrierIdByUser } = require("../repos/carriers.repo");
const {createContract , getContractsByShipperUser , contractExists } = require('../repos/contracts.repo.js')


const createContractService = async (shipperId , carrierUserId , packageId , startDate , endDate) => {
    const carrierId = await getCarrierIdByUser(carrierUserId)

    if(!carrierId){
        return error
    }

    const exists = await contractExists(carrierId , shipperId)

    if(exists){
        return error
    }

    const contract = await createContract(shipperId , carrierId , packageId , startDate , endDate);

    return contract;
}

const getContractsByShipperUserService = async (id , status) => {
    const contracts = await getContractsByShipperUser(id , status)

    return contracts
}

module.exports = {createContractService , getContractsByShipperUserService}