'use strict';

var _ = require('lodash'),
  db_opts = require('./database.json')[process.env.NODE_ENV ||
    'development'];

module.exports = {
  status: {
    OK: 200,
    ERROR: 500,
    BAD_REQ: 400
  },

  db: {
    client: db_opts.driver,
    connection: _.pick(db_opts, 'host', 'port', 'user', 'password',
      'database', 'multipleStatements'),
    pool: {
      min: 2,
      max: 10
    }
  },

  access_control: {
    origin: '*',
    headers: 'Origin, X-Requested-With, Content-Type, Accept'
  },

  data_dir: '/home/bijosh/Private/miniq_data/',

  ack_timeout: 120000//Time in millisecond
};
