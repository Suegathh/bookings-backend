const { Router } = require("express");
const { getUser, createUser, loginUser, logoutUser } = require("../controller/userController");
const { auth } = require("../middleware/authMidlleware");

const router = Router();

router.get("/", auth, getUser)
router.post("/", createUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)

module.exports = router;