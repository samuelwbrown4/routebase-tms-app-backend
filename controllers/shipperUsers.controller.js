const { createShipperUserService, getShipperUserByEmailService, updateNewShipperUserService , getAllShipperUsersService , editShipperUserService} = require('../services/shipperUsers.service');
const {getCompanyIdService} = require('../services/shippers.service')
const bcrypt = require('bcrypt');
const { transporter } = require('../email/mailer');


const createShipperUser = async (req, res) => {
    try {
        const { payload } = req.body

        let newUser = await createShipperUserService(payload)
        //send email
        if (newUser) {
            await transporter.sendMail({
                from: process.env.GOOGLE_USER,
                to: payload.email,
                subject: 'Welcome to Routebase! Set your password',
                text: 'Your account has been created. Please set your password using the provided link. https://routebase.cloud/user/create-password'
                
            });
        }
        res.status(200).json({ newUser })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const editShipperUser = async (req , res) => {
    try{
        const {payload} = req.body
        const {userId} = req.params
        console.log('userId' , userId)
        payload.userId = userId
        let editedUser = await editShipperUserService(payload);

        res.status(201).json({editedUser})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}


const updateNewShipperUser = async (req, res) => {
    try {
        const { password } = req.body
        const { email } = req.params
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await getShipperUserByEmailService(email)
        const updatedUser = await updateNewShipperUserService(user, hashedPassword)
        res.status(200).json({ updatedUser })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

const getAllShipperUsers = async (req , res) => {
    try{
        const {id} = req.user
        const companyId = await getCompanyIdService(id);

        const users = await getAllShipperUsersService(companyId)
        res.status(200).json({users})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = { createShipperUser, updateNewShipperUser , getAllShipperUsers , editShipperUser}