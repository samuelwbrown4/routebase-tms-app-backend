const {createContract , getContractsByShipperUser} = '../repos/contracts.repo.js'

const createContractService = async (shipperId , carrierId , packageId , startDate , endDate) => {
    const contract = await createContract(shipperId , carrierId , packageId , startDate , endDate);
    return contract;
}

const getContractsByShipperUserService = async (id) => {
    const contracts = await getContractsByShipperUser(id)

    return contracts
}

module.exports = {createContractService , getContractsByShipperUserService}