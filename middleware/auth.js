const jws = require('jsonwebtoken');

function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token' });

    } else {
        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = jws.verify(token, process.env.JWT_SECRET);
            if (decodedToken.role === 'admin') {
                return next();
            } else {
                return res.status(403).json({ error: 'Not permitted' })
            }
        } catch {
            return res.status(401).json({ error: 'Invalid token' })
        }
    }
}

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.split(' ')[1];
    try {
      jws.verify(token, process.env.JWT_SECRET);
       
        return next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = { requireAdmin , requireAuth }