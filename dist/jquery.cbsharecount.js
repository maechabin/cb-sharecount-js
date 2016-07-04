'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
 * jquery.cbsharecount.js v1.2.1
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
  var Share = function () {
    function Share(element, i, options) {
      _classCallCheck(this, Share);

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
        cacheTime: 86400000
      };
      this.data = {
        facebook: {
          api_url: 'http://graph.facebook.com/',
          param_name: 'id',
          count: 0
        },
        hatena: {
          api_url: 'http://api.b.st-hatena.com/entry.count',
          param_name: 'url',
          count: 0
        }
      };
    }

    _createClass(Share, [{
      key: 'getCount',
      value: function getCount() {
        var d = new $.Deferred();

        $.ajax({
          type: 'get',
          url: this.api_url,
          cache: true,
          dataType: 'jsonp',
          data: this.send_data,
          success: d.resolve,
          error: d.reject
        });
        return d.promise();
      }
    }, {
      key: 'view',
      value: function view(arg) {
        var that = this;
        $(arg).each(function (i) {
          switch (i) {
            case 0:
              that.data.facebook.count = this[0].shares || this[0].likes || 0;
              break;
            case 1:
              that.data.hatena.count = this[0];
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
      key: 'render',
      value: function render() {
        var fb = $('.cb-fb').eq(this.num).find('span');
        var hb = $('.cb-hb').eq(this.num).find('span');
        fb.html(this.data.facebook.count);
        hb.html(this.data.hatena.count);
      }
    }, {
      key: 'save',
      value: function save() {
        localStorage.setItem('sc_' + this.site_url, JSON.stringify({
          fb: this.data.facebook.count,
          hb: this.data.hatena.count,
          saveTime: new Date().getTime()
        }));
        localStorage.setItem('cbsharecount', new Date().getTime());
      }
    }, {
      key: 'setup',
      value: function setup() {
        var _this = this;

        var that = this;
        var df = [];

        $.each(this.data, function (key, val) {
          _this.api_url = val.api_url;
          _this.send_data[val.param_name] = _this.site_url;
          df.push(_this.getCount());
        });

        $.when.apply($, df).done(function () {
          return that.view(arguments);
        });
      }
    }, {
      key: 'checkCache',
      value: function checkCache() {
        var cache = void 0;
        var currentTime = void 0;

        if ('localStorage' in window && window.localStorage !== null) {
          cache = JSON.parse(localStorage.getItem('sc_' + this.site_url)) || null;
          currentTime = new Date().getTime();

          if (cache && currentTime - cache.saveTime < this.conf.cacheTime) {
            this.data.facebook.count = cache.fb;
            this.data.hatena.count = cache.hb;
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

    return Share;
  }();

  $.fn.cbShareCount = function (options) {
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

    return this.each(function (i) {
      new Share(this, i, options).init();
    });
  };
});
