# koa-locale

> Get locale variable from query, subdomain, the last domain, accept-languages or cookie for koa.

[![NPM version][npm-img]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### Installation

```bash
$ npm install koa-locale
```

### Usage

```js
var app = require('koa')();
var locale = require('koa-locale');

// the locale key name defaults to `locale`
locale(app, 'language');

app.use(function *(next) {
  // query: '?language=en'
  this.body = this.getLocaleFromQuery();
});
```

### API

#### ctx.getLocaleFromQuery(), ctx.request.getLocaleFromQuery()

```
/?locale=en-US
```

#### ctx.getLocaleFromSubdomain(), ctx.request.getLocaleFromSubdomain()

```
zh-CN.koajs.com
```

#### ctx.getLocaleFromHeader(multi = false), ctx.request.getLocaleFromHeader(multi = false)

```
Accept-Language: zh-CN,zh;q=0.5
```

#### ctx.getLocaleFromCookie(), ctx.request.getLocaleFromCookie()

```
Cookie: locale=zh-TW
```

#### ctx.getLocaleFromUrl(options), ctx.request.getLocaleFromUrl(options)

```
http://koajs.com/en
```

```
options = { offset: 2 }

http://koajs.com/foo/bar/en
```

#### ctx.getLocaleFromTLD(), ctx.request.getLocaleFromTLD()

```
http://koajs.com/
http://koajs.cn/
http://koajs.it/
```

### License

  MIT

[npm-img]: https://img.shields.io/npm/v/koa-locale.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-locale
[travis-img]: https://img.shields.io/travis/koa-modules/locale.svg?style=flat-square
[travis-url]: https://travis-ci.org/koa-modules/locale
[coveralls-img]: https://img.shields.io/coveralls/koa-modules/locale.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koa-modules/locale?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/koa-modules/locale.svg?style=flat-square
[david-url]: https://david-dm.org/koa-modules/locale
