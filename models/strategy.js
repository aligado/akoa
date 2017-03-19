var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Strategy = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true},
  sleepTime: { type: Number, required: true },
  reqTime: { type: Number, required: true },
  hint: { type: String, required: true },
  updated_at: { type: Date, default: Date.now }
});

Strategy.index({name: 1});

module.exports = mongoose.model('Strategy', Strategy);
/**
 * sample
 * data = { name:'test', url:'www.baidu.com', sleepTime:'1000', reqTime:'10'} 
 */