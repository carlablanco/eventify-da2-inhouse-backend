const jwt = require('jsonwebtoken');
const {
    SECRET_KEY_JWT,
    NODE_ENV
} = require("../constants");

function verifyToken(req, res, next) {
    let token = req.header('Authorization');

    if (!token) return res.status(401).json({ status: 'fail', message: 'Access denied' });

    token = req.header('Authorization').slice(7);

    if (NODE_ENV === 'development') {
        return res.status(200).json({ status: 'success', message: 'Token verified' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY_JWT);
        const currentTime = Date.now();

        if (decoded.exp < currentTime) {
            return res.status(401).json({ status: 'fail', message: 'Token has expired' });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
};

module.exports = verifyToken;