'use strict';

var code = require('../resources/config').status;

module.exports = function (req, res, next) {

  res.success = function (data) {
    res.status(code.OK)
      .json(data);
  };

  res.error = function (err) {
    console.log('Error occured: ', err);
    res.status(code.ERROR)
      .json('Something went Wrong!!!');
  };

  res.validationError = function (data) {
    console.log('Validation err: ', data);
    res.status(code.BAD_REQ)
      .json(data);
  };

  next();
};
