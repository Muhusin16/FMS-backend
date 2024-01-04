const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true
  },
  teamAdmin: {
    type: String,
    required: true
  },
  teamMembers: {
    type: [String],
    required: true
  },
  teamImage: {
    type: String,
    required: true
  },
});

const TeamMember = mongoose.model('Team', teamMemberSchema);

module.exports = TeamMember;