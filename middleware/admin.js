module.exports = async (req, res, next) => {
    if (req.user.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};
