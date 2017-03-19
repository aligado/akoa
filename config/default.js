var path = require('path');

module.exports = {
  port: process.env.PORT || 3004,
  userId: 'alpc32',
  mongodb: {
    url: 'mongodb://192.168.99.100:32768/akoa'
  },
  static: path.join(__dirname, '../theme/publices'),
};