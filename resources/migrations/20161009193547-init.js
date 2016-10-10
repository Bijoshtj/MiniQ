'use strict';

exports.up = function(db, callback) {
  db.runSql('CREATE TABLE `queue` (' +
    '`id` varchar(10) NOT NULL,' +
    '`description` varchar(20) DEFAULT NULL,' +
    '`create_time` datetime DEFAULT NULL,' +
    'PRIMARY KEY (`id`)' +
    ') ENGINE=InnoDB DEFAULT CHARSET=latin1;', function () {
      db.runSql('CREATE TABLE `queue_data` (' +
        '`id` int(10) unsigned NOT NULL AUTO_INCREMENT,' +
        '`queue_id` varchar(10) NOT NULL,' +
        '`status` tinyint(1) DEFAULT '0',' +
        '`create_time` datetime DEFAULT NULL,' +
        '`consumed_at` datetime DEFAULT NULL,' +
        'PRIMARY KEY (`id`),' +
        'KEY `fk_queue_id` (`queue_id`),' +
        'CONSTRAINT `fk_queue_id` FOREIGN KEY (`queue_id`) REFERENCES `queue` (`id`)'+
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1;', function () {
          callback();
        });
    }); 
};

exports.down = function(db, callback) {
  db.runSql('DROP TABLE queue;', function () {
    db.runSql('DROP TABLE queue_DATA;', function () {
      callback();
    });
  });
};
