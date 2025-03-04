const { Router } = require("express");
const { 
    getUsers,
    createUser,
    loginUser, 
    logoutUser
 } = require('../controller/userController')
const { auth } = require("../middleware/authMidlleware");

const router = Router();

router.get("/", auth, getUsers)
router.post("/", createUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)

module.exports = router;