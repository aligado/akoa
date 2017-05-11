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
const static  = require('koa-static');

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

app.use(function (ctx, next) {
  ctx.state = ctx.state || {};
  ctx.state.session = ctx.session
  return next();
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

app.use( async function(ctx, next) {
  ctx.body = JSON.stringify({abcde:'abcdefg', 123:465})
})
/*
app
  .use(router.routes())
  .use(router.allowedMethods());
*/

if (module.parent) {
  module.exports = app.callback()
} else {
  app.listen(3001, function () {
    console.log('Server listening on: ', config.port)
  });
}