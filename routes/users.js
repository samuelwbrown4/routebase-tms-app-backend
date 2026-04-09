const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require('../db/pool');

router.post('/login', async (req, res) => {

    try {
        const { email, password , client} = req.body;

        const table = client === 'shipper' ? 'shipper_users' : 'carrier_users'

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Incomplete credentials!' })
        }
        let result = await pool.query(`
            SELECT
                ${table}.email,
                ${table}.password_hash,
                ${table}.role,
                ${table}.id,
                ${table}.first_name,
                ${table}.last_name
                
            FROM
                ${table}
            WHERE
                ${table}.email = $1` ,
            [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const validPassword = await bcrypt.compare(password, result.rows[0].password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({id: result.rows[0].id, role: result.rows[0].role , email: result.rows[0].email, firstName: result.rows[0].first_name, lastName: result.rows[0].last_name , client: client }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ token })


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;