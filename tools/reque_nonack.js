'use strict';

var miniq = require('../models/miniq');

miniq.reQueueConsumed()
  .then(function () {
    console.log('Requeued.....');
  })
  .finally(function () {
    process.exit();
  });
