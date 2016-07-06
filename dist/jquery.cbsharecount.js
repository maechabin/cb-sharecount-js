'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
 * jquery.cbsharecount.js v2.0.1
 * Auther @maechabin
 * Licensed under mit license
 * https://github.com/maechabin/jquery.cb-share-count.js
 */
;(function (factory) {
  if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
    module.exports = factory(require('jquery'), window);
  } else {
    factory(jQuery, window);
  }
})(function ($, window) {
  var ShareCount = function () {
    function ShareCount(element, i, options) {
      _classCallCheck(this, ShareCount);

      this.element = element;
      this.$element = $(element);
      this.site_url = '';
      this.api_url = '';
      this.param_name = '';
      this.send_data = {};
      this.num = i;
      this.options = options;
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
            api_url: 'http://query.yahooapis.com/v1/public/yql',
            param: {
              q: 'SELECT content FROM data.headers WHERE url="https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=' + url + '"',
              format: 'xml',
              env: 'http://datatables.org/alltables.env'
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
      value: function getCount(key) {
        var d = new $.Deferred();

        $.ajax({
          type: 'get',
          url: this.api_url,
          cache: true,
          dataType: 'jsonp',
          data: this.send_data,
          success: d.resolve,
          error: d.reject,
          context: key
        });
        return d.promise();
      }
    }, {
      key: 'takeCount',
      value: function takeCount(key, arg) {
        var that = this;
        var keyArray = key.split(',');

        $(arg).each(function (i) {
          var self = $.extend({}, this, { key: keyArray[i] });
          var obj = this[0] ? this[0] : this;
          switch (self.key) {
            case 'fb':
              that.count.fb = obj.shares || obj.likes || 0;
              break;
            case 'hb':
              that.count.hb = obj || 0;
              break;
            case 'tw':
              that.count.tw = obj.count || 0;
              break;
            case 'pk':
              if (this[0].results) {
                var content = obj.results.toString();
                var match = content.match(/&lt;em id="cnt"&gt;(\d+)&lt;\/em&gt;/i);
                that.count.pk = match != null ? match[1] : 0;
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
        var _this = this;

        var that = this;
        var df = [];
        var data = that.setParam(that.site_url);
        $.each(data, function (key, val) {
          _this.api_url = val.api_url;
          _this.send_data = val.param;
          df.push(_this.getCount(key));
        });

        $.when.apply($, df).done(function () {
          return that.takeCount(this.toString(), arguments);
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var fb = $('.cb-fb').eq(this.num).find('span');
        var hb = $('.cb-hb').eq(this.num).find('span');
        var tw = $('.cb-tw').eq(this.num).find('span');
        var pk = $('.cb-pk').eq(this.num).find('span');
        if (this.conf.assign.includes('fb')) fb.html(this.count.fb || '');
        if (this.conf.assign.includes('hb')) hb.html(this.count.hb || '');
        if (this.conf.assign.includes('tw')) tw.html(this.count.tw || '');
        if (this.conf.assign.includes('pk')) pk.html(this.count.pk || '');
      }
    }, {
      key: 'save',
      value: function save() {
        var cache = JSON.parse(localStorage.getItem('sc_' + this.site_url)) || {};
        var count = {};
        var margedCount = {};

        if (this.conf.assign.includes('fb')) count.fb = this.count.fb;
        if (this.conf.assign.includes('hb')) count.hb = this.count.hb;
        if (this.conf.assign.includes('tw')) count.tw = this.count.tw;
        if (this.conf.assign.includes('pk')) count.pk = this.count.pk;
        count.saveTime = new Date().getTime();
        margedCount = $.extend({}, cache, count);
        localStorage.setItem('sc_' + this.site_url, JSON.stringify(margedCount));
        localStorage.setItem('cbsharecount', new Date().getTime());
      }
    }, {
      key: 'checkCache',
      value: function checkCache() {
        var _this2 = this;

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
            this.conf.assign.map(function (key) {
              return _this2.count[key] = cache[key] || '';
            });
            return this.render();
          }
        }
        return this.setup();
      }
    }, {
      key: 'init',
      value: function init() {
        this.site_url = this.$element.attr('title');
        this.conf = $.extend({}, this.defaults, this.options);
        if (this.conf.cache) {
          this.checkCache();
        } else {
          this.setup();
        }
        return this;
      }
    }]);

    return ShareCount;
  }();

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
      new ShareCount(this, i, options).init();
    });
  };
});
