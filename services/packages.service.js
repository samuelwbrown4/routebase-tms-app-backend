const {getPkgsByCarrierUser} = require('../repos/packages.repo');

const getPkgsByCarrierUserService = async(id) => {
    const packages = await getPkgsByCarrierUser(id);

    return packages;
}

module.exports = {getPkgsByCarrierUserService}