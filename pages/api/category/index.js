const nc = require('next-connect');
const catchAsync = require('../../../utils/catchAsync');
const Category = require('./../../../models/categoryModel');
const authController = require('./../../../controllers/authController');
const dbConnect = require('./../../../lib/mongoose');

const handler = nc({
  onError: authController.handleError,
  onNoMatch: authController.handleNoMatch,
});

handler.get(
  catchAsync(async (req, res, next) => {
    await dbConnect();

    const categories = await Category.find({});

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories,
      },
    });
  })
);

handler.post(
  authController.protect,
  authController.restrictTo('admin', 'coach'),
  catchAsync(async (req, res, next) => {
    const newCategory = await Category.create({ name: req.body.name });
    res.status(200).json({
      status: 'success',
      message: 'Category Added Successfully',
      data: {
        newCategory,
      },
    });
  })
);

export default handler;
