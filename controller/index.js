'use strict';

var miniq = require('../models/miniq');

module.exports = {
  before: function (req, res, next) {
    next();
  },

  enqueue: function (req, res) {
    var rules = {
      queue_id: {
        required: true,
        type: 'string',
        min_len: 4,
        max_len: 10
      },
      data: {
        required: true,
        type: 'string',
        min_len: 5
      }
    };

    if (req.validate(rules)) {
      miniq.enqueue(req.body)
        .then(res.success, res.error);
    }
  },

  dequeue: function (req, res) {
    var rules = {
      queue_id: {
        required: true,
        type: 'string',
        min_len: 4,
        max_len: 10
      }
    };

    if (req.validate(rules)) {
      miniq.dequeue(req.body.queue_id)
        .then(res.success, res.error);
    }
  },

  ack: function (req, res) {
    var rules = {
      id: {
        required: true,
        type: 'int'
      },
      ack: {
        required: true,
        type: 'string',
        min_len: 3,
        max_len: 5
      }
    };

    if (req.validate(rules)) {
      miniq.acknowledge(req.body)
        .then(res.success, res.error);
    }
  }
};
