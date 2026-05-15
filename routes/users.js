const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require('../db/pool');

router.post('/login', async (req, res) => {

    try {
        const { email, password, client } = req.body;

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
                ${table}.email = $1 AND ${table}.newUser = false`,
            [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const validPassword = await bcrypt.compare(password, result.rows[0].password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role, email: result.rows[0].email, firstName: result.rows[0].first_name, lastName: result.rows[0].last_name, client: client }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const refreshToken = jwt.sign(
            { id: result.rows[0].id, client: client },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        console.log('cookie set')


        res.json({ token })


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token' });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const table = decoded.client === 'shipper' ? 'shipper_users' : 'carrier_users';

        const result = await pool.query(`
            SELECT id, role, email, first_name, last_name
            FROM ${table}
            WHERE id = $1
        `, [decoded.id]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        const newToken = jwt.sign(
            { id: user.id, role: user.role, email: user.email, firstName: user.first_name, lastName: user.last_name, client: decoded.client },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ token: newToken });

    } catch (err) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
});
module.exports = router;