'use strict';

exports.up = function(db, callback) {
  db.removeColumn('queue_data', 'status', callback);
};

exports.down = function(db, callback) {
  db.addColumn('queue_data', 'status', {
    type: 'tinyint',
    unsigned: true,
    notNull: true,
    defaultValue: 0,
    length: 1
  }, callback);
};
