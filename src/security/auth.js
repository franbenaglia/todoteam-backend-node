//

const jwt = require('jsonwebtoken');
const SECRET_KEY = require('./constants.js');

function verifyToken(req, res, next) {

    const header = req.header('Authorization');//Bearer token 

    if (!header) return res.status(401).json({ error: 'Access denied' });

    const token = header.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;