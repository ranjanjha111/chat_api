const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
// const admin = require('../middleware/admin')

const {
    getUsers,
    saveChat,
    getChats,
    uploadFile
} = require('../controllers/chat')

router.get('/chat/users', auth, getUsers);
router.get('/chat/:userId', auth, getChats);
router.post("/chat", auth, saveChat);
router.post("/chat/upload", auth, uploadFile);

module.exports = router