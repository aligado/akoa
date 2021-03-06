var mongoose = require('mongoose');
var config = require('config-lite').mongodb;
mongoose.Promise = global.Promise
mongoose.connect(config.url, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.url, err.message);
    process.exit(1);
  }
});

exports.DB = mongoose;
exports.User = require('./user');
exports.Topic = require('./topic');
exports.Comment = require('./comment');
exports.Strategy = require('./strategy');
exports.Item = require('./Item');