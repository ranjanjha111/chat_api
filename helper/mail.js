const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = (to, subject, body) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        text: body,
    };

    sgMail.send(mailOptions, (error, result) => {
        if (error) return res.status(500).json({success: false, error: error.message});

        return result;
    }); 
}

const singupVerificationMail = (user, token) => {
    let link = process.env.FRONT_END_URL + "/activate/" + token;

    return sendMail(
        user.email,
        `Account activation request`,
        `Hi ${user.name} \n Please click on the following link ${link} to activate your account. \n\n `
    );
}

const singupVerifiedMail = (user) => {
    return sendMail(
        user.email,
        `Account activation confirmation`,
        `Hi ${user.name} \n This is a confirmation that the your account ${user.email} has been activated.\n`
    );
}

const forgotPasswordMail = (user) => {
    let link = process.env.FRONT_END_URL + "/auth/reset/" + user.resetPasswordToken

    sendMail(
        user.email,
        `Password change request`,
        `Hi ${user.name} \n 
            Please click on the following link ${link} to reset your password. \n\n 
            If you did not request this, please ignore this email and your password will remain unchanged.\n`                    
    );

    res.status(200).json({success: true, message: 'A reset email has been sent to ' + user.email + '.'})
}

module.exports = {
    singupVerificationMail,
    singupVerifiedMail,
    forgotPasswordMail    
};