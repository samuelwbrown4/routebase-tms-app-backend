const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require('../db/pool');

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Incomplete credentials!' })
        }
        let result = await pool.query(`
            SELECT
                shipper_users.email,
                shipper_users.password_hash,
                shipper_users.role,
                shipper_users.id,
                shipper_users.first_name,
                shipper_users.last_name
                
            FROM
                shipper_users
            WHERE
                shipper_users.email = $1` ,
            [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const validPassword = await bcrypt.compare(password, result.rows[0].password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({id: result.rows[0].id, role: result.rows[0].role , email: result.rows[0].email, firstName: result.rows[0].first_name, lastName: result.rows[0].last_name }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ token })


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;