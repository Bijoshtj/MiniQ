'use strict';

var knex = require('knex'),
  fs = require('fs'),
  bluebird = require('bluebird'),
  config = require('../../resources/config'),
  knex_obj = knex(config.db),
  getFileName = function (q_id, data_id) {
    return 'q' + q_id + data_id;
  };

bluebird.promisifyAll(fs);

module.exports = {
  knex: knex_obj,

  addQueueRecord: function (queue_id, desc) {
    return knex_obj('queue')
      .where('id', '=', queue_id)
      .first()
      .then(function (que) {
        if (que) {
          return true;
        }
        return knex_obj('queue')
          .insert({
            id: queue_id,
            description: desc || '',
            create_time: new Date()
          });
      });
  },

  addDataToFile: function (file_name, data) {
    return fs.writeFileAsync(config.data_dir + file_name, data);
  },

  getData: function (file_name) {
    return fs.readFileAsync(config.data_dir + file_name)
      .then(function (content) {
        return content.toString();
      });
  },

  deleteData: function (file_name) {
    return fs.unlinkAsync(config.data_dir + file_name);
  },

  getDataRec: function (id) {
    return knex_obj('queue_data')
      .where('id', '=', id)
      .first();
  },

  updateQueue: function (id, status, consume) {
    var opts = {
      status: status
    };

    if (consume) {
      opts.consumed_at = new Date();
    }

    return knex_obj('queue_data')
      .where('id', '=', id)
      .update(opts);
  },

  enqueue: function (queue_id, data) {
    return knex_obj('queue_data')
      .insert({
        queue_id: queue_id,
        status: 0,
        create_time: new Date()
      })
      .then(function (resp) {
        var data_id = resp[0];

        return this.addDataToFile(getFileName(queue_id, data_id), data);
      }.bind(this));
  },

  dequeue: function (queue_id) {
    return knex_obj('queue_data')
      .where('queue_id', '=', queue_id)
      .orderBy('create_time', 'asc')
      .first()
      .then(function (rec) {
        var msg_id;

        if (!rec) {
          return false;
        }

        msg_id = rec.id;
        return this.updateQueue(msg_id, 1, true)
          .then(this.getData.bind(this, getFileName(rec.queue_id, msg_id)))
          .then(function (msg_data) {
            return {
              data: msg_data,
              id: msg_id
            };
          });
      }.bind(this));
  },

  requeue: function (id) {
    return knex_obj('queue_data')
      .where('id', '=', id)
      .whereNotNull('consumed_at')
      .update({
        status: 0,
        consumed_at: null
      });
  },

  delete: function (id) {
    return this.getDataRec(id)
      .then(function (rec) {
        if (!rec) {
          return false;
        }

        return knex_obj('queue_data')
          .where('id', '=', id)
          .del()
          .then(function () {
            return this.deleteData(getFileName(rec.queue_id, rec.id));
          }.bind(this));
      }.bind(this));
  },

  requeueCosumedNack: function (date) {
    return knex_obj('queue_data')
      .where('consumed_at', '<=', date)
      .update({
        status: 0,
        consumed_at: null
      });
  }
};
