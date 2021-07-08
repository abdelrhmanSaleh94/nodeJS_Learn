const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ massage: 'Access Denied . No Token provider' });
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();

    } catch (error) {
        res.status(400).json({ massage: 'invalid token' })
    }
}