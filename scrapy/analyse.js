const fs = require('fs'),
      utils = require('utility'),
      Item = require('../models').Item,
      cheerio = require('cheerio');

async function unique (list) {
  let res = []
  for (let i =0; i<list.length; i++) {
    let same = await Item.find({md5:list[i].md5})
    if ( same.length == 0 ) {
      res.push(list[i])
    }
  }
  return res
}

exports.xianyu = async function xianyu(html, name) {
  let $ = cheerio.load(html,{decodeEntities: false, ignoreWhitespace: true});
  const Items = []
  $('ul.item-lists li').each( (i, elem) => {
    const d = $(elem) 
    const _ = cheerio.load(d.html(),{decodeEntities: false, ignoreWhitespace: true});
    const item = {}
    item.image = _('.item-pic a img').attr('src')
    item.title = _('.item-title').text()
    item.url = _('.item-title a').attr('href')
    item.price = parseFloat(_('.item-price em').text())
    item.description = _('.item-description').text()
    item.sellerNick = _('.seller-info span').attr('data-nick')
    item.sellerUrl = _('.seller-info a').attr('href')
    item.sellerLocation = _('.seller-location').text()
    item.md5 = utils.md5(item)
    item.pubTime = _('.item-pub-time').text()
    item.name = name
    Items.push(item)
  })
  return await unique(Items)
}
