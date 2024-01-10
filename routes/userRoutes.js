const express =require("express");

const { registerUser, loginUser, homePage, getUser, verifyEmail, getUserById,   } = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser)

router.get("/home", homePage)

router.get("/user", getUser)

router.get("/user/:id", getUserById)

router.get('/verify-email/:token', verifyEmail)

module.exports = router;