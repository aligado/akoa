const Koa = require('koa');
const logger = require('koa-logger');
const errorhandler = require('koa-errorhandler');
const C = require('koa-convert');
const bodyparser = require('koa-bodyparser');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const config = require('config-lite');
const path = require('path');
const app = new Koa() 
const DB = require('./models').DB
const static  = require('koa-static');
const router = require('koa-router')();

var debug = require("debug")('akoa')

app.keys = ['alpc32']
app.use(async function (ctx, next) {
  await next()
})

app.use(C(errorhandler({'acceptType':'html'})))

app.use(async function (ctx, next) {
  debug('BEFORE request', ctx.request)
  debug('BEFORE response', ctx.response)
  await next()
  debug('AFTER request', ctx.request)
  debug('AFTER response', ctx.response)
})

app.use(bodyparser())
app.use(logger())

app.use(C(session({
})))

app.use(async function (ctx, next) {
  ctx.state = ctx.state || {};
  ctx.state.session = ctx.session
  await next()
  ctx.res.setHeader('Content-Type', 'application/json;charset=utf-8')
  ctx.res.setHeader('Access-Control-Allow-Origin', '*');
})

app.use(async function (ctx, next) {
  /*
  if (ctx.session.user) {
    console.log( ctx.session.user )
  }
  */
  console.log( ctx.session )
  if (!ctx.session.user) ctx.session.user = 'alpc32'
  else console.log( ctx.session.user )
  //ctx.redirect('/')
  await next()
})

/*
app.use( async function(ctx, next) {
  let list = []
  for (let name in DB.models) {
    let db = DB.models[name]
    let cnt = await db.find({}).count().exec()
    list.push({name, cnt})
  }
  ctx.body = JSON.stringify( {data: list} )
  ctx.res.setHeader('Content-Type', 'application/json')
  ctx.res.setHeader('Access-Control-Allow-Origin', '*');
})
*/

router.get('/col', async function (ctx, next) {
  let list = []
  for (let name in DB.models) {
    let db = DB.models[name]
    let cnt = await db.find({}).count().exec()
    list.push({name, cnt})
  }
  ctx.body = JSON.stringify( {data: list} )
})

router.post('/edit/:name', async function (ctx, next) {
  let name = ctx.params.name
  let data = ctx.request.body
  let id = data._id
  console.log(data)
  console.log(name)
  delete data['_id']
  let res = await DB.models[name].findByIdAndUpdate(id,  {$set: data}).exec()
  console.log(res)
  ctx.body = JSON.stringify( {'res':'success'} )
})

router.get('/doc/:name/:skip', async function (ctx, next) {
  let name = ctx.params.name
  let skip = Number(ctx.params.skip)
  console.log( name )
  let list = []
  let cc = await DB.models[name].find({}).skip(skip).limit(20).exec()
  // console.log(cc)
  // ctx.body = 'hello'
  console.log( cc )
  ctx.body = JSON.stringify( {data: cc} )
})

app
  .use(router.routes())
  .use(router.allowedMethods())
/*
app
  .use(router.routes())
  .use(router.allowedMethods());
*/

if (module.parent) {
  module.exports = app.callback()
} else {
  app.listen(config.port, function () {
    console.log('Server listening on: ', config.port)
  });
}