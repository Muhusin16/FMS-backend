const Vote = require("../models/voteModel");

// Create a new vote
const createVote = async (req, res) => {
  try {
    const { best_debut, leadership_quality, punctual_person, most_talented } = req.body;

    const newVote = new Vote({
      best_debut,
      leadership_quality,
      punctual_person,
      most_talented,
    });

    const savedVote = await newVote.save();
    res.json(savedVote);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Get all votes
const getVotes = async (req, res) => {
  try {
    const votes = await Vote.find();
    res.json(votes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Get a specific vote by ID
const getVoteById = async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id);
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }
    res.json(vote);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Update a specific vote by ID
const updateVote = async (req, res) => {
  try {
    const { best_debut, leadership_quality, punctual_person, most_talented } = req.body;

    const updatedVote = await Vote.findByIdAndUpdate(
      req.params.id,
      {
        best_debut,
        leadership_quality,
        punctual_person,
        most_talented,
      },
      { new: true }
    );

    if (!updatedVote) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    res.json(updatedVote);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Delete a specific vote by ID
const deleteVote = async (req, res) => {
  try {
    const deletedVote = await Vote.findByIdAndRemove(req.params.id);
    if (!deletedVote) {
      return res.status(404).json({ message: 'Vote not found' });
    }
    res.json({ message: 'Vote deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

module.exports = { createVote, getVotes, getVoteById, updateVote, deleteVote };

