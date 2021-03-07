const Contact = require('../models/contact');
const User = require('../models/user');
const {
    sendContactMailToAdmin } = require('../helper/mail')

const contactUs = (req, res) => {
    const { company, subject, message, userId } = req.body;
    const data = {
        company,
        subject,
        message
    }

    userId !== '' ? data.user = userId : ''
    console.log(data)
    
    let conatct = new Contact(data)
    conatct.save(data)
    .then((data) => {
        //mailToAdmin
        sendContactMailToAdmin(message);
        res.json(data);
    }).catch(error => {
        console.log(error)
        return res.status(500).json({
            error: 'Error occurred. Message could not be sent.'
        });
    });
};

module.exports = {
    contactUs
}