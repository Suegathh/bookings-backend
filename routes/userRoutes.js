const { Router } = require("express");
const { 
    getUsers,
    createUser,
    loginUser, 
    logoutUser
} = require("../controller/userController");
const { auth } = require("../middleware/authMiddleware"); // ✅ Fix import typo

const router = Router();

router.get("/", auth, getUsers); // ✅ Protected: Requires authentication
router.post("/register", createUser); // ✅ Clearer path for registration
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
