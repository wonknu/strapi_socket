/**!
 * pedding - index.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

module.exports = pedding;

function pedding(n, fn) {
  if (typeof n === 'function') {
    var tmp = n;
    n = fn;
    fn = tmp;
  }

  var called = false;
  var times = 0;
  var callStack = new Error();
  callStack.name = 'CallStack';
  return function (err) {
    if (called) {
      return;
    }
    if (err) {
      called = true;
      return fn(err);
    }
    times++;
    if (times === n) {
      fn();
    } else if (times > n) {
      var err = new Error('Expect to call ' + n + ' times, but got ' + times);
      err.stack += '\n' + callStack.stack;
      throw err;
    }
  };
}
