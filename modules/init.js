'use strict';

var api = require('../controller/index'),
  before = api.before;

module.exports = function (app) {

  app.post('/enqueue', before, api.enqueue);
  app.post('/dequeue', before, api.dequeue);
  app.post('/ack', before, api.ack);
};
