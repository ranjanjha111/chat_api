const mongoose = require('mongoose')
const validator = require('validator')
const User = require('./user')

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },

    type: {
        type: String,
    },
    isDeleted: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

chatSchema.statics.getMessagesByUsers = async (from, to) => {
    let condition = { $or: [
        { from: from, to: to},
        { from: to, to: from}
    ]}

    const chat = await Chat.find(condition).sort({_id: -1})
    if(!chat) {
        return []
    }

    return chat;
}

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat