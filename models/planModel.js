const mongoose = require('mongoose');
import server from '../server';
import Video from './videoModel';

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please name is required.'],
    },
    description: {
      type: String,
      required: [true, 'Please description is required.'],
      maxlength: [
        250,
        'A plan description must have less or equal than 250 characters',
      ],
    },
    noOfDays: {
      type: Number,
      required: [true, 'Please noOfDays is required.'],
    },
    videos: {
      type: [
        [
          {
            type: mongoose.Schema.ObjectId,
            ref: 'Video',
          },
        ],
      ],
      required: [true, 'Please videos is required.'],
    },
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    duration: [
      {
        type: Number,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

planSchema.pre('save', async function (next) {
  const duration = [];
  for (const video of this.videos) {
    let totalDuration = 0;
    for (const v of video) {
      // console.log(`${server}/api/videos/${v.toString()}/duration`);
      const dbVideo = await Video.find({ _id: v.toString() });

      const gDriveId = dbVideo[0].gDriveID;

      const durationResponse = await fetch(
        `${server}/api/videos/${gDriveId}/duration`
      );
      const durationData = await durationResponse.json();

      totalDuration += parseInt(durationData.data.duration);
    }
    duration.push(totalDuration);
  }
  this.duration = duration;
});

let Plan;
try {
  Plan = mongoose.model('Plan');
} catch (err) {
  Plan = mongoose.model('Plan', planSchema);
}
// Plan = mongoose.model('Plan', PlanSchema);
// const User = mongoose.model('User') || mongoose.model('User', userSchema);
module.exports = Plan;
