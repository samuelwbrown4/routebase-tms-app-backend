const {createShipperUser , getShipperUserByEmail , updateNewShipperUser , getAllShipperUsers , editShipperUser} = require('../repos/shipperUsers.repo') ;

const createShipperUserService = async (payload) => {
    let newUser = await createShipperUser(payload);

    return newUser;
}

const editShipperUserService = async (payload) => {
    const editedUser = await editShipperUser(payload)

    return editedUser
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

module.exports = {createShipperUserService , getShipperUserByEmailService , updateNewShipperUserService , getAllShipperUsersService , editShipperUserService}