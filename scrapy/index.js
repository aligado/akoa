const Event = require('events').EventEmitter,
      Strategy = require('../models').Strategy,
      mrequest = require('../mutility').mrequest,
      sleep = require('../mutility').sleep,
      Item = require('../models').Item,
      utils = require('utility'),
      DB = require('../models').DB;
      xianyu = require('./analyse').xianyu,
      _ = require('lodash'),
      iconv = require('iconv-lite');

const testUrl = 'https://s.2.taobao.com/list/list.htm?st_edtime=1&page=1&q=new+3dsll&list=0';
function Err(err) {
  console.log("Scrapy:")
  console.log(err)
}

/*
mongo REQ
model:
      _id
      url
      sleepTime
      reqTime
      db
*/

class Scrapy { 

  constructor() {
    this.map = {} 
    this.cli = {}
    this.init()
  }

  init() {
    this.map = {} 
    this.cli = {}
  }

  async all() {
    const docs = await Strategy.find()
    return docs
  }

  async run(id) {
    console.log(id)
    if ( this.map[id] == 'run' || this.cli[id] == 'run' ) return
    else {
      let doc = await Strategy.find({_id:id}).exec()
      if ( doc.length > 0 ) doc = doc[0]
      else return 
      this.cli[id] = 'run'
      this.go(doc)
      this.cli[id] = ''
      this.map[id] = 'run'
    }
  }

  async stop(id) {
    if ( this.map[id] == 'stop' || this.cli[id] == 'stop' ) return
    else {
      this.cli[id] = 'stop'
    }
  }

  async go(doc) {
    if (doc.reqTime == 0) return
    const id = doc._id
    if ( this.cli[id] == 'stop' ) {
      this.cli[id] == ''
      this.map[id] == 'stop'
      return
    }
    const url = doc.url
    console.log("GO", url)
    const body = await mrequest(url)
    const docs = await xianyu(iconv.decode(body, 'gbk'), doc.name) 
    Item.create(docs)
    await this.resolveOne(doc)
    console.log(docs)
    await sleep(300000 + Number(doc.sleepTime) + Math.ceil(doc.sleepTime*Math.random()))
    this.go(doc)
    return 0
  }

  async resolveOne(doc) {
    if (doc.reqTime == -1) return
    doc.reqTime -= 1
    return Strategy.findByIdAndUpdate(doc._id,  {$set: {reqTime:doc.reqTime}}).exec()
  }
  removeOne(doc) {
    return Strategy.remove({_id:doc._id}).exec()
  }
  push(doc) {
    return Strategy.create(doc)
  }  
}

async function testRun() {
  scrapy = new Scrapy()
  const simple = { _id:123, name:'test', url:testUrl, sleepTime:100000, reqTime:'10', hint:'1234'} 
  //let doc = await req.push(simple) 
  scrapy.go(simple)
  //console.log(doc)
  //await req.resolveOne(doc)
  //await req.removeOne(simple)
  //await req.init()
  //await sleep(3000)
  //DB.disconnect()
}
module.exports = exports = Scrapy

if (!module.parent) {
  testRun()
    .catch(Err)
}