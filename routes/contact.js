const express = require('express')
const router = new express.Router()

const { contactUs } = require('../controllers/contact')

router.post('/contact', contactUs)

module.exports = router