const mongoose = require('mongoose');

const userPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User must belong to a user'],
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Plan',
    required: [true, 'Plan must belong to a plan'],
  },
  startDate: {
    type: Date,
    default: Date.now(),
  },
  progress: {
    type: Number,
    default: 0,
  },
  dayProgress: {
    type: Number,
    default: 0,
  },
});

let UserPlan;
try {
  UserPlan = mongoose.model('UserPlan');
} catch (err) {
  UserPlan = mongoose.model('UserPlan', userPlanSchema);
}

module.exports = UserPlan;
