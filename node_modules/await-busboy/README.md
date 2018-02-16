#await-busboy

[busboy][] multipart parser with `async/await` and [koa][]/[co][] `yield` support.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/await-busboy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/await-busboy
[travis-image]: https://img.shields.io/travis/aheckmann/await-busboy.svg?style=flat-square
[travis-url]: https://travis-ci.org/aheckmann/await-busboy
[codecov-image]: https://codecov.io/github/aheckmann/await-busboy/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/aheckmann/await-busboy?branch=master
[david-image]: https://img.shields.io/david/aheckmann/await-busboy.svg?style=flat-square
[david-url]: https://david-dm.org/aheckmann/await-busboy
[download-image]: https://img.shields.io/npm/dm/await-busboy.svg?style=flat-square
[download-url]: https://npmjs.org/package/await-busboy
[busboy]: https://github.com/mscdex/busboy
[co]: https://github.com/tj/co
[koa]: https://github.com/koajs/koa

_forked from https://github.com/cojs/busboy and updated to support async/await_

## Example

```js
const Koa = require('koa')
const app = new Koa()
const parse = require('await-busboy')

app.use(async (ctx, next) => {
  // the body isn't multipart, we can't parse it
  if (!ctx.request.is('multipart/*')) return await next

  const parts = parse(ctx)

  try {
    let part
    while ((part = await parts)) {
      if (part.length) {
        // arrays are await-busboy fields
        console.log({ key: part[0], value: part[1] })
      } else {
        // otherwise, it's a stream
        part.pipe(someOtherStream)
      }
    }
  } catch (err) {
    return ctx.throw(err)
  }

  ctx.body = 'await-busboy is done parsing the form!'
});

app.listen(3000);
```

Note that parts will be delievered in the order they are defined in the form.
Put your CSRF token first in the form and your larger files last.

If you want `await-busboy` to automatically handle the fields,
set the `autoFields: true` option.
Now all the parts will be streams and a field object and array will automatically be populated.

```js
const Koa = require('koa')
const app = new Koa()
const parse = require('await-busboy')

app.use(async (ctx, next) => {
  const parts = parse(ctx, {
    autoFields: true
  })

  try {
    let part
    while ((part = await parts)) {
      // it's a stream
      part.pipe(fs.createWriteStream('some file.txt'))
    }
  } catch (err) {
    return ctx.throw(err)
  }

  ctx.body = 'and we are done parsing the form!'

  // .field holds all the fields in key/value form
  console.log(parts.field._csrf)

  // .fields holds all the fields in [key, value] form
  console.log(parts.fields[0])
})
```

### Example for csrf check

Use `options.checkField` hook `function(name, val, fieldnameTruncated, valTruncated)`
can handle fields check.

```js
const parse = require('await-busboy')

app.use(async (ctx, next) => {
  const parts = parse(ctx, {
    checkField: (name, value) => {
      if (name === '_csrf' && !checkCSRF(ctx, value)) {
        const err =  new Error('invalid csrf token')
        err.status = 400
        return err
      }
    }
  })

  let part
  while ((part = await parts)) {
    // ...
  }
})
```

### Example for filename extension check

Use `options.checkFile` hook `function(fieldname, file, filename, encoding, mimetype)`
can handle filename check.

```js
const parse = require('await-busboy')
const path = require('path')

app.use(async (ctx, next) {
  const parts = parse(ctx, {
    // only allow upload `.jpg` files
    checkFile: function (fieldname, file, filename) {
      if (path.extname(filename) !== '.jpg') {
        const err = new Error('invalid jpg image')
        err.status = 400
        return err
      }
    }
  })

  let part
  while ((part = await parts)) {
    // ...
  }
})
```

### co, koa and yield support

This module is backward compatible with [koa][], [co][] and `yield` syntax.

```js
const Koa = require('koa')
const app = new Koa()
const parse = require('await-busboy')

app.use(function* (ctx, next) {
  // the body isn't multipart, we can't parse it
  if (!ctx.request.is('multipart/*')) return yield next

  const parts = parse(ctx)

  try {
    let part
    while ((part = yield parts)) {
      if (part.length) {
        // arrays are await-busboy fields
        console.log({ key: part[0], value: part[1] })
      } else {
        // otherwise, it's a stream
        part.pipe(someOtherStream)
      }
    }
  } catch (err) {
    return ctx.throw(err)
  }

  ctx.body = 'await-busboy is done parsing the form!'
});
```

## API

### parts = parse(stream, [options])

```js
const parse = require('await-busboy')
const parts = parse(stream, {
  autoFields: true
})
```

`options` are passed to [busboy][].
The only additional option is `autoFields`.

**Note**: If [busboy][] events `partsLimit`, `filesLimit`, `fieldsLimit` is emitted, will throw an error.

### part = await parts

await the next part.
If `autoFields: true`, this will always be a file stream.
Otherwise, it will be a [field](https://github.com/mscdex/busboy#busboy-special-events) as an array.

- Readable Stream

    - `fieldname`
    - `filename`
    - `transferEncoding` or `encoding`
    - `mimeType` or `mime`

- Field[]

    0. `fieldname`
    1. `value`
    2. `valueTruncated` - `Boolean`
    3. `fieldnameTruncated` - Boolean

If falsey, then the parser is done.

### parts.field{}

If `autoFields: true`, this object will be populated with key/value pairs.

### parts.fields[]

If `autoFields: true`, this array will be populated with all fields.

## Development

### Running tests

- `npm test` runs tests + code coverage + lint
- `npm run lint` runs lint only
- `npm run lint-fix` runs lint and attempts to fix syntax issues
- `npm run test-cov` runs tests + test coverage
- `npm run open-cov` opens test coverage results in your browser
- `npm run test-only` runs tests only

## LICENSE

[MIT](https://github.com/aheckmann/await-busboy/blob/master/LICENSE)
