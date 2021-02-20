const User = require('../models/user');
const Chat = require('../models/chat');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, '../uploads')
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage }).single('file')

const uploadFile = (req, res ) => {
    upload(req, res, err => {
        console.log(err)
        if(err) {
            return res.json({success: false, error: err})
        }
        
        return res.json({success: true, url: res.req.file.path})
    })
}

const getUsers = async (req, res) => {
    let match = {_id: { $ne: req.user._id }}
    if(req.query.name) {
        match.name = { $regex: '.*' + req.query.name + '.*' , $options: 'i'}
    }

    const users = await User.find(match)

    console.log(Object.keys(users).length)
    if(!Object.keys(users).length) {
        return res.status(400).json({
            error: 'User not found'
        });
    }

    res.send(users)
}

const getChats = async (req, res) => {
    let condition = { $or: [
        { from: req.user._id, to: req.params.userId},
        { from: req.params.userId, to: req.user._id}
    ]}

    const chat = await Chat.find(condition).sort({_id: -1})
    if(!chat) {
        return res.status(400).json({
            error: 'User not found'
        });
    }

    res.send(chat)
}

const saveChat = async (req, res) => {
    let message = {
        message: req.body.message,
        from: req.body.from,
        to: req.body.to,
        type: req.body.type
    }

    const chat = new Chat(message)
    try {
        await chat.save()
        res.status(201).json({ chat })
    } catch (e) {
        res.status(400).send({error: 'Message not saved.'})
    }
}

module.exports = {
    getUsers,
    saveChat,
    getChats,
    uploadFile
}