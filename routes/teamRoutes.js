const express = require('express');
const { createTeam, getallTeam, getoneTeam, updateTeam, deleteTeam } = require('../controllers/teamControllers');

const router = express.Router();

router.post("/create", createTeam);

router.get("/team", getallTeam);

router.get("/team/:id", getoneTeam)

router.put("/update/:id", updateTeam);

router.delete("/delete/:id", deleteTeam)

module.exports = router;