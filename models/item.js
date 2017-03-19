var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*
item.Image = _('.item-pic a img').attr('src')
    item.Title = _('.item-title').text()
    item.Url = _('.item-title a').attr('href')
    item.Price = parseFloat(_('.item-price em').text())
    item.Description = _('.item-description').text()
    item.SellerNick = _('.seller-info span').attr('data-nick')
    item.SellerUrl = _('.seller-info a').attr('href')
    item.SellerLocation = _('.seller-location').text()
    item.md5 = utils.md5(item)
    item.PubTime = _('.item-pub-time').text()
    item.name = nam
*/

var Item = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true},
  url: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  sellerNick: { type: String, required: true },
  sellerUrl: { type: String, required: true },
  sellerLocation: { type: String, required: true },
  md5: { type: String, required: true },
  pubTime: { type: String, required: true },
});

Item.index({name: 1});

module.exports = mongoose.model('Item', Item);
/**
 * sample
 * data = { name:'test', url:'www.baidu.com', sleepTime:'1000', reqTime:'10'} 
 */