const mongoose = require('mongoose');

const guidelineSchema = new mongoose.Schema({
	guidelineid: {
    type: String,
  },
  policyid: {
    type: String,
    required: true,
  }, 
  policy: {
        type: String,
        required: true
    },
  priority: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Guideline', guidelineSchema);
