const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = async (req, res, next) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if (!decoded) {
            throw new Error()
        }

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if(user.status === 0) {
            user.status = 1
            req.user = user
        } else {
            return res.status(401).send({ error: 'Account has already been activated. Please signin.' })
        }

        next()
    } catch (e) {
        res.status(401).send({ error: 'Invalide token.' })
    }
}