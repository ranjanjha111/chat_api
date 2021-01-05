const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

// const isAdmin = async (req, res, next) => {
//     if (req.user.role === 0) {
//         return res.status(403).json({
//             error: 'Admin resourse! Access denied'
//         });
//     }
//     next();
// };

// module.exports = {
//     auth,
//     isAdmin
// }