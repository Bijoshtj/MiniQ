'use strict';

var data_store = require('./data/store'),
  config = require('../resources/config');

module.exports = {
  enqueue: function (data) {
    var q_id = data.queue_id;

    return data_store.addQueueRecord(q_id)
      .then(data_store.enqueue.bind(data_store, q_id, data.data));
  },

  dequeue: function (queue_id) {
    return data_store.dequeue(queue_id);
  },

  acknowledge: function (data) {
    var ack = data.ack,
      msg_id = data.id,
      promise;

    if (ack === 'NACK') {
      promise = data_store.requeue(msg_id);
    } else {
      promise = data_store.delete(msg_id);
    }

    return promise
      .then(function () {
        return 'Success';
      });
  },

  reQueueConsumed: function () {
    var time_out = new Date(Date.now() - config.ack_timeout);

    return data_store.requeueCosumedNack(time_out);
  }
};
