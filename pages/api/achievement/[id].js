const nc = require('next-connect');
const authController = require('../../../controllers/authController');
const catchAsync = require('../../../utils/catchAsync');
const PDFDocument = require('pdfkit');
const Plan = require('../../../models/planModel');
const dbConnect = require('../../../lib/mongoose');

const buildPDF = (dataCallback, endCallback, plan) => {
  const doc = new PDFDocument({
    size: 'C4',
    layout: 'landscape',
  });
  doc.on('data', dataCallback);
  doc.on('end', endCallback);
  doc.fontSize(25).text('Congratulations!', 100, 50);
  doc.fontSize(20).text(`You have completed ${plan.name}`, 100, 100);
  doc.image('public/achievement.png', 150, 20, { width: 550 });

  doc.end();
};

const handler = nc({
  onError: authController.onError,
  onNoMatch: authController.onNoMatch,
});

handler.get(
  // authController.protect,
  catchAsync(async (req, res, next) => {
    await dbConnect();
    const { id } = req.query;

    const plan = await Plan.findById(id);
    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment;filename=mypdf.pdf`,
    });

    buildPDF(
      (data) => stream.write(data),
      () => stream.end(),
      plan
    );
  })
);

export default handler;
