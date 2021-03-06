(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShareCount = function () {
  function ShareCount(element, i, options) {
    _classCallCheck(this, ShareCount);

    this.element = element;
    this.$element = (0, _jquery2.default)(element);
    this.site_url = '';
    this.api_url = '';
    this.param_name = '';
    this.send_data = {};
    this.num = i;
    this.options = options;
    this.jqxhr = {};
    this.defaults = {
      cache: true,
      cacheTime: 86400000,
      assign: ['fb', 'hb', 'tw', 'pk']
    };
    this.count = {
      fb: 0,
      hb: 0,
      tw: 0,
      pk: 0
    };
  }

  _createClass(ShareCount, [{
    key: 'setParam',
    value: function setParam(url) {
      var data = {};
      var defaultData = {
        fb: {
          api_url: 'https://graph.facebook.com/',
          param: {
            id: url
          }
        },
        hb: {
          api_url: 'http://api.b.st-hatena.com/entry.count',
          param: {
            url: url
          }
        },
        tw: {
          api_url: 'https://jsoon.digitiminimi.com/twitter/count.json',
          param: {
            url: url
          }
        },
        pk: {
          api_url: 'https://query.yahooapis.com/v1/public/yql',
          param: {
            q: 'SELECT content FROM data.headers WHERE url=\n            \'https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=' + url + '&src=' + url + '\'',
            format: 'xml',
            env: 'store://datatables.org/alltableswithkeys'
          }
        }
      };
      this.conf.assign.map(function (key) {
        return data[key] = defaultData[key];
      });
      return data;
    }
  }, {
    key: 'getCount',
    value: function getCount(key, id) {
      var _this = this;

      var d = new _jquery2.default.Deferred();

      this.jqxhr[id] = _jquery2.default.ajax({
        type: 'get',
        url: this.api_url,
        cache: false,
        timeout: 10000,
        dataType: 'jsonp',
        data: this.send_data,
        success: d.resolve,
        error: d.reject,
        context: key
      }).fail(function () {
        return _this.jqxhr[id].abort();
      });

      return d.promise();
    }
  }, {
    key: 'takeCount',
    value: function takeCount(key, arg) {
      var that = this;
      var keyArray = key.split(',');

      (0, _jquery2.default)(arg).each(function (i) {
        var self = _jquery2.default.extend({}, this, { key: keyArray[i] });
        var obj = this[0] ? this[0] : this;
        switch (self.key) {
          case 'fb':
            that.count.fb = 'share' in obj && 'share_count' in obj.share ? obj.share.share_count : 0;
            break;
          case 'hb':
            that.count.hb = Array.isArray(obj) ? obj[0] : obj || 0;
            break;
          case 'tw':
            that.count.tw = obj.count || 0;
            break;
          case 'pk':
            if (this[0].results) {
              var content = obj.results.toString();
              var match = content.match(/&lt;em id="cnt"&gt;(\d+)&lt;\/em&gt;/i);
              that.count.pk = match !== null ? Number(match[1]) : 0;
            }
            break;
          default:
            break;
        }
      });
      if (that.conf.cache) {
        that.save();
      }
      return that.render();
    }
  }, {
    key: 'setup',
    value: function setup() {
      var _this2 = this;

      var that = this;
      var df = [];
      var data = that.setParam(that.site_url);
      _jquery2.default.each(data, function (key, val) {
        var id = new Date().getTime();
        _this2.api_url = val.api_url;
        _this2.send_data = val.param;
        df.push(_this2.getCount(key, id));
      });

      _jquery2.default.when.apply(_jquery2.default, df).done(function () {
        return that.takeCount(this.toString(), arguments);
      }).fail(function (res) {
        return res.abort();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var fb = (0, _jquery2.default)('.cb-fb').eq(this.num).find('span');
      var hb = (0, _jquery2.default)('.cb-hb').eq(this.num).find('span');
      var tw = (0, _jquery2.default)('.cb-tw').eq(this.num).find('span');
      var pk = (0, _jquery2.default)('.cb-pk').eq(this.num).find('span');
      if (this.conf.assign.indexOf('fb') !== -1) fb.html(this.count.fb);
      if (this.conf.assign.indexOf('hb') !== -1) hb.html(this.count.hb);
      if (this.conf.assign.indexOf('tw') !== -1) tw.html(this.count.tw);
      if (this.conf.assign.indexOf('pk') !== -1) pk.html(this.count.pk);
    }
  }, {
    key: 'save',
    value: function save() {
      var cache = JSON.parse(localStorage.getItem('sc_' + this.site_url)) || {};
      var count = {};
      var margedCount = {};

      if (this.conf.assign.indexOf('fb') !== -1) count.fb = this.count.fb;
      if (this.conf.assign.indexOf('hb') !== -1) count.hb = this.count.hb;
      if (this.conf.assign.indexOf('tw') !== -1) count.tw = this.count.tw;
      if (this.conf.assign.indexOf('pk') !== -1) count.pk = this.count.pk;
      count.saveTime = new Date().getTime();
      margedCount = _jquery2.default.extend({}, cache, count);
      localStorage.setItem('sc_' + this.site_url, JSON.stringify(margedCount));
      localStorage.setItem('cbsharecount', new Date().getTime());
    }
  }, {
    key: 'checkCache',
    value: function checkCache() {
      var _this3 = this;

      var cache = void 0;
      var nocache = void 0;
      var currentTime = void 0;

      if ('localStorage' in window && window.localStorage !== null) {
        cache = JSON.parse(localStorage.getItem('sc_' + this.site_url)) || null;
        currentTime = new Date().getTime();

        if (cache) {
          nocache = this.conf.assign.filter(function (key) {
            return cache[key] === undefined;
          });
          if (nocache.length > 0) {
            return this.setup();
          }
        }

        if (cache && currentTime - cache.saveTime < this.conf.cacheTime) {
          // console.log(cache.fb);
          this.conf.assign.map(function (key) {
            return _this3.count[key] = typeof cache[key] === 'number' ? cache[key] : '';
          });
          return this.render();
        }
      }
      return this.setup();
    }
  }, {
    key: 'callMethod',
    value: function callMethod(callback) {
      if (callback) {
        return callback();
      }
      return false;
    }
  }, {
    key: 'init',
    value: function init() {
      this.site_url = this.$element.attr('title');
      this.conf = _jquery2.default.extend({}, this.defaults, this.options);
      if (this.conf.cache) {
        this.callMethod(this.checkCache());
      } else {
        this.callMethod(this.setup());
      }
      return this;
    }
  }]);

  return ShareCount;
}();

exports.default = ShareCount;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

var _ShareCount = require('ShareCount');

var _ShareCount2 = _interopRequireDefault(_ShareCount);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * jquery.cbsharecount.js v2.1.0
 * Auther @maechabin
 * Licensed under mit license
 * https://github.com/maechabin/jquery.cb-share-count.js
 */

(function (factory) {
  if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
    module.exports = factory((typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null), require('ShareCount'), window);
  } else {
    factory(_jquery2.default, window);
  }
})(function ($, window) {
  $.fn.cbShareCount = function cbShareCount(options) {
    var lastSaveTime = void 0;
    var storage = window.localStorage || null;
    var cacheTime = options.cacheTime || 86400000;
    var currentTime = new Date().getTime();
    if ('localStorage' in window && storage !== null) {
      lastSaveTime = JSON.parse(localStorage.getItem('cbsharecount')) || null;
      if (lastSaveTime && currentTime - lastSaveTime > cacheTime) {
        Object.keys(storage).map(function (key) {
          if (~key.indexOf('sc_http')) {
            delete storage[key];
          }
          return storage;
        });
      }
    }

    return this.each(function shareCount(i) {
      new _ShareCount2.default(this, i, options).init();
    });
  };
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"ShareCount":1}]},{},[2]);
