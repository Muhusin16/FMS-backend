// const express = require("express");
const TeamMember = require("../models/teamModel");

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { teamName, teamAdmin, teamMembers, teamImage } = req.body;
    const newTeam = new TeamMember({
      teamName,
      teamAdmin,
      teamMembers,
      teamImage,
    });

    const savedTeam = await newTeam.save();
    res.json(savedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Get all teams
const getallTeam = async (req, res) => {
  try {
    const teams = await TeamMember.find();
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Get a specific team by ID
const getoneTeam = async (req, res) => {
  try {
    const team = await TeamMember.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const updateTeam = async (req, res) => {
    try {
      const { teamName, teamAdmin, teamMembers, teamImage } = req.body;
      
      const updatedTeam = await TeamMember.findByIdAndUpdate(
        req.params.id,
        { teamName, teamAdmin, teamMembers, teamImage },
        { new: true }
      );
  
      if (!updatedTeam) {
        return res.status(404).json({ msg: "Team not found" });
      }
  
      res.json(updatedTeam);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  };
  
// Delete a team by ID
const deleteTeam = async (req, res) => {
  try {
    const deletedTeam = await TeamMember.findOneAndDelete({ _id: req.params.id });

    if (!deletedTeam) {
      return res.status(404).json({ msg: "Team not found" });
    }

    res.json({ msg: "Team deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


module.exports = { createTeam, getallTeam, getoneTeam, updateTeam, deleteTeam };
