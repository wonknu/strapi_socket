'use strict'

// like a promise
// if a value is added, it is queued until the first then()
// if then() is called before a value is available,
//   the returned promise is deferred
//   and queued up for later resolution eg when the next value is available or the
//   Result is completed.

const CLOSED = Promise.resolve()

module.exports = class Result {
  constructor () {
    this._isClosed = false
    this._pendingPromises = []
    this._pendingVals = []

    // TODO Nice to have ...array argument -> add()
  }

  add (val) {
    if (this.isClosed) {
      throw new Error('cannot add() to a closed Result')
    }

    if (this._pendingPromises.length > 0) {
      this._finishPromises(val)
    } else {
      this._pendingVals.push(val)
    }
  }

  get isClosed () {
    return this._isClosed
  }

  get hasValues () {
    return this._pendingVals.length > 0
  }

  /**
   * Requests the next value, wrapped in a promise.
   * If no more values are available and the Result
   * is closed, a Promise resolved to undefined is returned.
   * Else, the returned promise will resolve or reject
   * when the next value is added.
   *
   * @param {Function} res
   * @param {Function} rej
   * @return {Promise}
   */
  then (res, rej) {
    if (this.hasValues) {
      const val = this._pendingVals.shift()
      const method = val instanceof Error ? 'reject' : 'resolve'
      return Promise[method](val).then(res, rej)
    }

    if (this.isClosed) {
      // no more values will ever be available
      return CLOSED.then(res, rej)
    }

    const p = new Promise((resolve, reject) => {
      this._pendingPromises.push({ resolve, reject })
    })

    return p.then(res, rej)
  }

  close (val) {
    this.add(val)
    this._isClosed = true
  }

  _finishPromises (val) {
    const method = val instanceof Error ? 'reject' : 'resolve'

    let promise
    while ((promise = this._pendingPromises.shift())) {
      promise[method](val)
    }
  }
}
