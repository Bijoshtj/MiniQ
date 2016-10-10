'use strict';

var _ = require('lodash'),
  validator = require('validator'),
  typeCheck = function (value, type) {
    switch (type) {
      case 'int':
        return _.isInteger(value);
      case 'string':
        return _.isString(value);
      default:
        return true;
    }
  },
  validate = function (value, rule, rule_val) {
    var res = true;

    if (rule === 'required' && rule_val === true &&
      _.isNil(value)) {
      res = 'Value cant be empty';
    } else if (rule === 'min_len' && (value || '').length < rule_val) {
      res = 'Value should have min length: ' + rule_val;
    } else if (rule === 'max_len' && (value || '').length > rule_val) {
      res = 'Value should have max length: ' + rule_val;
    } else if (rule === 'type' && !typeCheck(value, rule_val)) {
      res = 'Value should be ' + rule_val;
    } else if (rule === 'acceptables' && _.indexOf(rule_val, value) < 0) {
      res = 'Unaccepted value';
    }

    return res;
  },
  sanitize = function (val, type) {
    var int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;

    switch (type) {
      case 'string':
        return validator.toString(val);
      case 'int':
        return int.test(val) ? validator.toInt(val, 10) : val;
      default:
        return val;
    }
  };

module.exports = function (req, res, next) {

  req.validate = function (rules) {
    var body = req.body || {},
      err = {};

    _.each(rules, function (rule, prop) {
      body[prop] = sanitize(body[prop], rule.type);
      _.each(rule, function (val, type) {
        var res = validate(body[prop], type, val);

        if (res !== true) {
          if (!err[prop]) {
            err[prop] = [];
          }
          err[prop].push(res);
        }
      });
    });

    if (!_.isEmpty(err)) {
      res.validationError(err);
      return false;
    }

    return true;
  };

  next();
};
