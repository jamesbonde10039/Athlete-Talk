import nc from 'next-connect';
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const handler = nc({
  onError: (err, req, res) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ err: 'Page not found' });
  },
});

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// Limiting request from same IP
handler.use('/api', limiter);
// Setting security HTTP headers
handler.use(helmet());
// Data sanitization against NoSQL query injection💉
handler.use(mongoSanitize());
// Data sanitization against XSS
handler.use(xss());
// Prevent parameter pollution
handler.use(hpp());

module.exports = handler;
