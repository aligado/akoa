const fs = require('fs'),
      cheerio = require('cheerio'),
      iconv = require('iconv-lite'),
      base = require('../mutility'),
      savedContent = base.savedContent,
      readContent = base.readContent,
      sleep = base.sleep,
      mrequest = require('../mutility').mrequest,
      Item = require('../models').Item,
      utils = require('utility')

const testUrl = 'https://s.2.taobao.com/list/list.htm?st_edtime=1&page=1&q=new+3ds&ist=0'

class Scrapy {
  constructor() {
  }

  async testRun () {
    const self = this
    self.go()
    this.on("go", async () => {
      self.queueIndex = (self.queueIndex+1) % self.queue.length
      await self.go(self.queue[self.queueIndex])
    })
  }
}


async function analyseHtml(html, name) {
  console.log(html)
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
    /*await db.findDocuments({md5:item.md5}) 
            .then( (docs) => {
              if (docs.length === 0) Items.push(item)
            })*/
    Items.push(item)
  })
  return Items
}

module.exports = exports = Scrapy
/*
if (!module.parent) {
}
*/