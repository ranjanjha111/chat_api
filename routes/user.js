const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const {
    userProfile,
    getUser,
    getUsers,
    updateUser,
} = require('../controllers/user')
const { route } = require('./auth')

router.get('/users/:id', auth, getUser);
// router.put('/user/:userId', auth, updateUser);

router.get('/users/me', auth, userProfile)
// router.get('/users', auth, admin, getUsers)
// router.get('/users', auth, getUsers)
router.get('/users', getUsers)
router.patch('/users/me', auth, updateUser)

module.exports = router