'use strict';

var _ = require('lodash'),
  validate = function (value, rule, rule_val) {
    var err = false;

    if (rule === 'required' && rule_val === true 
      && _.isNil(value)) {
      err = 'Value cant be empty';
    }

    return err;
  };

module.exports = function (req, res, next) {

  req.validate = function (rules) {
    var body = req.body || {},
      err = false;

    //_.each(rules, function (rule, prop) {
    //  _.each(rule, function (val, type) {
    //    if (validate(body[prop], type, val))
    //  });
    //});
    return true;
  };

  next();
};
