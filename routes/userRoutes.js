const express =require("express");

const { registerUser, loginUser, homePage, getUser } = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser)

router.get("/home", homePage)

router.get("/user", getUser)

module.exports = router;