const express = require("express")
const router = express.Router()
const auth = require('../middleware/auth')
const activate = require('../middleware/activate')

const {
    signup,
    signin,
    signout,
    signoutAll,
    recover,
    reset,
    resetPassword,
    activateAccount
} = require("../controllers/auth")
const { userSignupValidator } = require("../validator")

router.post("/signup", userSignupValidator, signup)
router.get("/activate/:token", activate, activateAccount)
router.post("/signin", signin)
router.get("/signout", auth, signout)
router.get("/signoutall", auth, signoutAll)
router.post("/auth/recover", recover)
router.get("/auth/reset/:token", reset)
router.post("/auth/reset/:token", resetPassword)

module.exports = router;