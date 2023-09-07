import mongoose from 'mongoose';
import Plan from '../../../models/planModel';

const nc = require('next-connect');
const catchAsync = require('../../../utils/catchAsync');
const authController = require('./../../../controllers/authController');
const dbConnect = require('./../../../lib/mongoose');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.get(
  authController.protect,
  catchAsync(async (req, res, next) => {
    //get all plans sorted by user's preferred categories

    const plans = await Plan.find({}).populate('creator');

    res.status(200).json({
      status: 'success',
      results: plans.length,
      data: {
        plans,
        preferredCategories: req.user.preferredCategories,
      },
    });
  })
);

handler.post(
  authController.protect,
  authController.restrictTo('admin', 'coach'),
  catchAsync(async (req, res, next) => {
    const plan = Object.assign(req.body, {
      creator: req.user._id.toString(),
    });

    await Plan.create(plan);

    res.status(200).json({
      status: 'success',
      message: 'Plan Added Successfully',
    });
  })
);

export default handler;
