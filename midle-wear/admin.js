module.exports = function(req, res, next) {
    if (!req.user.isAdmin) return res.status(403).json({ massage: 'Access Denied' });
    next();
}