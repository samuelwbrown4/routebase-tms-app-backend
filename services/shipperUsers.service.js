const {createShipperUser , getShipperUserByEmail , updateNewShipperUser , getAllShipperUsers} = require('../repos/shipperUsers.repo') ;

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

const getAllShipperUsersService = async (companyId) => {
    let users = await getAllShipperUsers(companyId);

    return users
}

module.exports = {createShipperUserService , getShipperUserByEmailService , updateNewShipperUserService , getAllShipperUsersService}