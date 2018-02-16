/*!
 * locale
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

/**
 * Module dependences.
 */

var delegate = require('delegates');

/**
 * Expose
 *
 * @param {Object} app
 * @param {String} key - locale key name.
 *
 * @returns {Object} app
 */

module.exports = function(app, key) {
  key = key || 'locale';
  var request = app.request;

  // From query, `locale=en`
  Object.defineProperty(request, 'getLocaleFromQuery', {
    value: function() {
      return this.query[key];
    }
  });

  // From query, `locale=en`
  Object.defineProperty(request, 'getLocaleFromSubdomain', {
    value: function() {
      return this.subdomains.pop();
    }
  });

  // From accept-language, `Accept-Language: zh-CN`
  Object.defineProperty(request, 'getLocaleFromHeader', {
    value: function(multi) {
      var accept = this.acceptsLanguages() || '',
        reg = /(^|,\s*)([a-z-]+)/gi,
        locales = [],
        match;
      while ((match = reg.exec(accept))) {
        locales.push(match[2])
        if (!multi && locales.length) {
          break;
        }
      }
      return multi ? locales : locales[0];
    }
  });

  // From cookie, `locale=zh-CN`
  Object.defineProperty(request, 'getLocaleFromCookie', {
    value: function() {
      return this.ctx.cookies.get(key);
    }
  });

  // From URL, `http://koajs.com/en`
  Object.defineProperty(request, 'getLocaleFromUrl', {
    value: function(options) {
      var segments = this.path.substring(1).split('/');
      return segments[options && options.offset || 0];
    }
  });

  // From The Latest Domain, `http://koajs.com`, `http://kojs.cn`
  Object.defineProperty(request, 'getLocaleFromTLD', {
    value: function() {
      return this.hostname.split('.').pop();
    }
  });

  /**
   * Delegate to this.ctx.
   */

  delegate(app.context, 'request')
    .method('getLocaleFromQuery')
    .method('getLocaleFromSubdomain')
    .method('getLocaleFromHeader')
    .method('getLocaleFromCookie')
    .method('getLocaleFromUrl')
    .method('getLocaleFromTLD');

  return app;
};
