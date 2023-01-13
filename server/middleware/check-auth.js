const jwt = require('jsonwebtoken');

const jsonwebtoken = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    console.log(req.headers.authorization.replace(/Bearer /g, ''));
    const token = req.headers.authorization.replace(/Bearer /g, ''); // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 403);
    console.log(err);
    //return next(error);
  }
};
