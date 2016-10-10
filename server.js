'use strict';

var express = require('express'),
  app = express(),
  body_parser = require('body-parser'),
  validator = require('./modules/validator'),
  resp_handler = require('./modules/response');

app.use(body_parser.urlencoded({extended: true}));

// Setting 10MB max limit for incoming data.
app.use(body_parser.json({limit: '10mb'}));
app.use(resp_handler);
app.use(validator);

require('./modules/init')(app);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));

