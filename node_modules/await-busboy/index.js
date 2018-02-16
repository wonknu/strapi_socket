'use strict'

const Busboy = require('busboy')
const BlackHoleStream = require('black-hole-stream')
const Result = require('./result')

const getDescriptor = Object.getOwnPropertyDescriptor
const isArray = Array.isArray

module.exports = (request, options) => {
  const res = new Result()

  // - what used to be a `chan` will now be a thenable
  // - each time the thenable.then() is called, a Promise is returned. when the
  // next value is ready, the promise is resolved with it OR if the value is an
  // error, the promise is rejected and the thenable is marked done.
  // - if a done thenable is awaited, a Promise resolved with
  // an empty value is returned.

  // koa special sauce
  request = request.req || request

  options = options || {}
  options.headers = request.headers
  // options.checkField hook `function(name, val, fieldnameTruncated, valTruncated)`
  // options.checkFile hook `function(fieldname, fileStream, filename, encoding, mimetype)`
  const checkField = options.checkField
  const checkFile = options.checkFile
  let lastError

  const busboy = new Busboy(options)

  request.on('close', cleanup)

  busboy
  .on('field', onField)
  .on('file', onFile)
  .on('close', cleanup)
  .on('error', onEnd)
  .on('finish', onEnd)

  busboy.on('partsLimit', () => {
    const err = new Error('Reach parts limit')
    err.code = 'Request_parts_limit'
    err.status = 413
    onError(err)
  })

  busboy.on('filesLimit', () => {
    const err = new Error('Reach files limit')
    err.code = 'Request_files_limit'
    err.status = 413
    onError(err)
  })

  busboy.on('fieldsLimit', () => {
    const err = new Error('Reach fields limit')
    err.code = 'Request_fields_limit'
    err.status = 413
    onError(err)
  })

  request.pipe(busboy)

  if (options.autoFields) {
    var field = res.field = {} // object lookup
    var fields = res.fields = [] // list lookup
  }

  return res

  function onField (name, val, fieldnameTruncated, valTruncated) {
    if (checkField) {
      const err = checkField(name, val, fieldnameTruncated, valTruncated)
      if (err) {
        return onError(err)
      }
    }

    const args = [name, val, fieldnameTruncated, valTruncated]

    if (options.autoFields) {
      fields.push(args)

      // don't overwrite prototypes
      if (getDescriptor(Object.prototype, name)) return

      const prev = field[name]

      if (prev == null) {
        field[name] = val
        return
      }

      if (isArray(prev)) {
        prev.push(val)
        return
      }

      field[name] = [prev, val]
    } else {
      res.add(args)
    }
  }

  function onFile (fieldname, file, filename, encoding, mimetype) {
    if (checkFile) {
      const err = checkFile(fieldname, file, filename, encoding, mimetype)
      if (err) {
        // make sure request stream's data has been read
        const blackHoleStream = new BlackHoleStream()
        file.pipe(blackHoleStream)
        return onError(err)
      }
    }

    file.fieldname = fieldname
    file.filename = filename
    file.transferEncoding = file.encoding = encoding
    file.mimeType = file.mime = mimetype
    res.add(file)
  }

  function onError (err) {
    lastError = err
  }

  function onEnd (err) {
    cleanup()
    res.close(err || lastError)
  }

  function cleanup () {
    request.removeListener('close', cleanup)
    busboy.removeListener('field', onField)
    busboy.removeListener('file', onFile)
    busboy.removeListener('close', cleanup)
    busboy.removeListener('error', onEnd)
    busboy.removeListener('partsLimit', onEnd)
    busboy.removeListener('filesLimit', onEnd)
    busboy.removeListener('fieldsLimit', onEnd)
    busboy.removeListener('finish', onEnd)
  }
}
