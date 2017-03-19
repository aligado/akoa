const router = require('koa-router')();
const Item = require('./models').Item;
const Strategy = require('./models').Strategy;
const config = require('config-lite');
const Scrapy = require('./scrapy');
const _ = require('lodash');

const scrapy = new Scrapy()

function checkLogin(ctx) {
  if (ctx.session.user) return true
  return false
}

router.get('/strategy/stop/:id', async function (ctx, next) {
  if (!checkLogin(ctx)) {
    ctx.flash = {error:'please login'}
    ctx.redirect('/login')
    return
  }
  const id = ctx.params.id
  scrapy.stop(id)
  ctx.redirect('/stratege')
})

router.get('/strategy/run/:id', async function (ctx, next) {
  if (!checkLogin(ctx)) {
    ctx.flash = {error:'please login'}
    ctx.redirect('/login')
    return
  }
  const id = ctx.params.id
  scrapy.run(id)
  ctx.redirect('/stratege')
})

router.get('/strategy/:name', async function (ctx, next) {
  if (!checkLogin(ctx)) {
    ctx.flash = {error:'please login'}
    ctx.redirect('/login')
    return
  }
  const name = ctx.params.name
  const items = await Item.find({name:name}).exec();
  let ths = [],
      td = [],
      tds = [] 
  if (items.length == 0) {
    ctx.flash = {error:"EMPTY"} 
    ctx.redirect('/stratege')
    return
  }
  items.forEach( (item, index) => {
    td = []
    _.mapKeys(item._doc, (v, k) => {
      if ( k == '_id' || k == '__v' || k == 'md5' ) return
      if (index === 0) ths.push(k)
      if ( k == 'image' || k == 'sellerUrl' || k == 'url' ) 
        td.push('<a href="'+v+'">'+'link'+'</a')
      else td.push(v)
    })
    tds.push(td)
  })
  await ctx.render('strategy', {ths, tds, name});
})

router.get('/strategy', async function (ctx, next) {
  if (!checkLogin(ctx)) {
    ctx.flash = {error:'please login'}
    ctx.redirect('/login')
    return
  }

  const items = await Strategy.find().exec();
  let ths = [],
      td = [],
      tds = [] 
  items.forEach( (item, index) => {
    td = []
    _.mapKeys(item._doc, (v, k) => {
      if (k == 'updated_at' || k == '__v') return
      if (index === 0) ths.push(k)
      if ( k == 'name' ) td.push('<a href="/strategy/'+v+'">'+v+'</a>')
      else if ( k == '_id' ) {
        console.log( 'map', scrapy.map[v])
        if ( scrapy.map[v] == 'run' && scrapy.cli[v] !== 'stop') td.push('<a href="/strategy/stop/'+v+'">'+'停止</a>')
        else td.push('<a href="/strategy/run/'+v+'">'+'启动</a>')
      }
      else td.push(v)
    })
    tds.push(td)
  })
  await ctx.render('strategylist', {ths, tds});
})

router.get('/newstrategy', async function (ctx, next) {
  if (!checkLogin(ctx)) {
    ctx.redirect('/login')
    return
  }
  await ctx.render('newstrategy');
})

router.post('/newstrategy', async function (ctx, next) {
  ctx.body = ctx.request.body
  const doc = await scrapy.push(ctx.body)
  scrapy.run(doc)
  ctx.redirect('/strategy')
})

router.get('/logout', async function (ctx, next) {
  if (ctx.session.user) {
    ctx.session = null
  }
  ctx.redirect('/login')
})

router.get('/login', async function (ctx, next) {
  console.log("hello login")
  if (ctx.session.user)
    ctx.redirect('strategy');
  else await ctx.render('newlogin') 
})
router.post('/login', async function (ctx, next) {
  const userId = config.userId
  if ( userId != ctx.request.body.id ) {
    ctx.flash = {error: 'WRONG ID'}
    await ctx.render('/newlogin')
  } else {
    ctx.session.user = userId
    ctx.flash = {success: 'LOGIN SUCCESS'}
    ctx.redirect('/stratege')
  }
})

router.get('/*', async function (ctx, next) {
  await ctx.redirect('/login');
})

module.exports = exports = router