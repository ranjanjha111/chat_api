const User = require('../models/user')
const {
    singupVerificationMail,
    singupVerifiedMail,
    forgotPasswordMail } = require('../helper/mail')

const signup = async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()

        // send email
        // singupVerificationMail(user, token)
        res.status(201).json({ user, token })     
    } catch (e) {
        res.status(400).send({error: 'Email is taken'})
    }
}

const activateAccount = async (req, res) => {
    try {
        let user = req.user
        if(!user) {
            return res.status(400).send({error: 'Invalid activation link.'})
        }

        await user.save()

        // send email
        // singupVerifiedMail(user)
    } catch (e) {
        res.status(400).send({error: 'Invalid link'})
    }
}

const signin = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        await user.updateLastLogin();
        const token = await user.generateAuthToken()

        res.send({isSignedIn:true, user, token })
    } catch (e) {
        res.status(400).send({isSignedIn: false, error: e.message})
    }
}

const signout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

const signoutAll = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

const recover = async (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({success: false, message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'})
            }

            //Generate and set password reset token
            user.generatePasswordReset();

            // Save the updated user object
            user.save()
                .then(user => {
                    // send email
                    forgotPasswordMail(user)
                })
                .catch(err => res.status(500).json({success: false, message: err.message}));
        })
        .catch(err => res.status(500).json({success: false, message: err.message}));
}

const reset = (req, res) => {
    User.findOne({
        resetPasswordToken: req.params.token, 
        // resetPasswordExpires: {$gt: Date.now()}
        resetPasswordExpires: {$gt: new Date()}
    })
        .then((user) => {
            if (!user) return res.status(401).json({success: false, message: 'Password reset token is invalid or has expired.'});

            //Redirect user to form with the email address
            res.status(200).json({success: true, user});
        })
        .catch(err => res.status(500).json({success: false, message: err.message}));
};

const resetPassword = (req, res) => {
    // User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: new Date()}})
        .then((user) => {
            if (!user) return res.status(401).json({success: false, message: 'Password reset token is invalid or has expired.'});

            //Set the new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            // Save
            user.save((err) => {
                if (err) return res.status(500).json({success: false, message: err.message});

                // send email
                const mailOptions = {
                    to: user.email,
                    from: process.env.FROM_EMAIL,
                    subject: "Your password has been changed",
                    text: `Hi ${user.name} \n 
                    This is a confirmation that the password for your account ${user.email} has just been changed.\n`
                };

                sgMail.send(mailOptions, (error, result) => {
                    if (error) return res.status(500).json({success: false, message: error.message});

                    res.status(200).json({success: true, message: 'Your password has been updated.'});
                });
            });
        });
};

module.exports = {
    signup,
    activateAccount,
    signin,
    signout,
    signoutAll,
    recover,
    reset,
    resetPassword
}