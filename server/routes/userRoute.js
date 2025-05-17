const express = require("express")
const router = express.Router()

const User = require("../controllers/userController")
const verifyJWT = require('../middleware/verifyJWT')

// פתוח לכולם
router.post("/register", User.register)
router.post("/login", User.login)

// רק למשתמשים שמחוברים
router.put("/updateUser", verifyJWT, User.updateUser)
router.delete("/deleteUser", verifyJWT, User.deleteUser)

module.exports = router
