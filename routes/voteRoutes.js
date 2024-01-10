const express = require("express")

const router = express.Router();

const {createVote} = require("../controllers/voteControllers")

router.post("/vote", createVote)

module.exports = router