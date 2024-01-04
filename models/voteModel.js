const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  best_debut: {
    type: Object,
    default: {},
  },
  leadership_quality: {
    type: Object,
    default: {},
  },
  punctual_person: {
    type: Object,
    default: {},
  },
  most_talented: {
    type: Object,
    default: {},
  },
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
