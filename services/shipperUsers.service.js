const {createShipperUser , getShipperUserByEmail , updateNewShipperUser} = require('../repos/shipperUsers.repo') ;

const createShipperUserService = async (locationId, erpId, firstName, lastName, email, phone, role) => {
    let newUser = await createShipperUser(locationId, erpId, firstName, lastName, email, phone, role);

    return newUser;
}

const getShipperUserByEmailService = async (email) => {
    let user = await getShipperUserByEmail(email);

    return user
}

const updateNewShipperUserService = async (user , hashedPassword) => {
    let updatedUser = await updateNewShipperUser(user , hashedPassword);

    return updatedUser
}

module.exports = {createShipperUserService , getShipperUserByEmailService , updateNewShipperUserService}