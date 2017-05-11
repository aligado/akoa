const Koa = require('koa');
const logger = require('koa-logger');
const errorhandler = require('koa-errorhandler');
const C = require('koa-convert');
const bodyparser = require('koa-bodyparser');
const static  = require('koa-static');
const flash = require('koa-flash');
const render = require('koa-ejs');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const config = require('config-lite');
const path = require('path');
const Stratege = require('./models').Strategy;
const app = new Koa() 

/*
var gzip = require('koa-gzip');
var scheme = require('koa-scheme');
var router = require('koa-frouter');
var routerCache = require('koa-router-cache');
var render = require('co-ejs');
*/

var debug = require("debug")('akoa')

app.keys = ['hello world']

//console.log( errorhandler().toString() )

app.use(async function (ctx, next) {
  await next()
})

app.use(C(errorhandler({'acceptType':'html'})))

app.use(async function (ctx, next) {
  debug('BEFORE request', ctx.request)
  debug('BEFORE response', ctx.response)
  await next()
  debug('AFTER request', ctx.request)
  //debug('AFTER request', ctx.request.body)
  debug('AFTER response', ctx.response)
})

app.use(bodyparser())
app.use(logger())
app.use(static(config.static));
app.use(C(session({
  store: new MongoStore(config.mongodb)
})));
app.use(C(flash()));

app.use(function (ctx, next) {
  ctx.state = ctx.state || {};
  ctx.state.now = new Date();
  ctx.state.ip = ctx.ip;
  ctx.state.version = '2.0.0';
  ctx.state.flash = ctx.flash
  ctx.state.session = ctx.session
  return next();
})

app.use( async function (ctx, next) {
  if (!ctx.session.user) ctx.session.user = 'hello'
  else {
    console.log( ctx.session.user )
  }
  await next()
})

app.use( async function (ctx) {
  ctx.body = 'hello'
})
//app.use(scheme(config.schemeConf));

//app.use(routerCache(app, config.routerCacheConf));
//app.use(gzip());
/*
app.use(render(app, renderConf));
app.use(router(app, config.routerConf));
*/

/*
app.use( async function (ctx, next) {
  debug('SESSION\n', ctx.session)
  debug('FLASH\n', ctx.flash)
  ctx.body = config.mongodb.url + 'hello alpc32'
})
*/


if (module.parent) {
  module.exports = app.callback()
} else {
  app.listen(config.port, function () {
    console.log('Server listening on: ', config.port)
  });
}