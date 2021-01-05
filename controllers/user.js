const { JsonWebTokenError } = require('jsonwebtoken');
const User = require('../models/user');

const userProfile = async (req, res) => {
    res.send(req.user);
}

const getUser = async (req, res) => {
    let user = req.user && req.user._id == req.params.id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }

    res.send(req.user)
}

const getUsers = async (req, res) => {
    const users = await User.find()
    if(!users) {
        return res.status(400).json({
            error: 'User not found'
        });
    }

    res.send(users)
}

// const updateUser = async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'company', 'country']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         updates.forEach((update) => req.user[update] = req.body[update])

//         await req.user.save()
//         res.send(req.user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// }

const updateUser = (req, res) => {
    // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { name, password, company, country } = req.body;

    User.findOne({ _id: req.user._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        if (!company) {
            return res.status(400).json({
                error: 'Company is required'
            });
        } else {
            user.company = company;
        }

        if (!country) {
            return res.status(400).json({
                error: 'Country is required'
            });
        } else {
            user.country = country;
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            // updatedUser.password = undefined;
            res.json(updatedUser);
        });
    });
};


module.exports = {
    userProfile,
    getUser,
    getUsers,
    updateUser,
 }