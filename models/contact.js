const mongoose = require('mongoose')
const User = require('./user')
// const validator = require('validator')

const contactSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    
    status: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact