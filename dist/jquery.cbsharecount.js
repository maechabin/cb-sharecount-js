/*!
 * jquery.cbsharecount.js v1.2.0
 * Auther @maechabin
 * Licensed under mit license
 * https://github.com/maechabin/jquery.cb-share-count.js
 */
;(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'), window, document);
  } else {
    factory(jQuery, window, document);
  }
} (function ($, window, document, undefined) {
  'use strict';

  var Share = function (element, i, options) {
    this.element = element;
    this.$element = $(element);
    this.site_url = '';
    this.api_url = '';
    this.param_name = '';
    this.send_data = {};
    this.num = i;
    this.options = options;
    this.defaults = {
      cacheTime: 86400000
    };
  };

  Share.prototype.data = {
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

  Share.prototype.getCount = function getCount() {
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
  };

  Share.prototype.view = function view(arg) {
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
    that.save();
    return that.render();
  };

  Share.prototype.render = function render() {
    var fb = $('.cb-fb').eq(this.num).find('span');
    var hb = $('.cb-hb').eq(this.num).find('span');
    fb.html(this.data.facebook.count);
    hb.html(this.data.hatena.count);
  };

  Share.prototype.save = function save() {
    localStorage.setItem('sc_' + this.site_url, JSON.stringify({
      fbCount: this.data.facebook.count,
      hbCount: this.data.hatena.count,
      saveTime: new Date().getTime()
    }));
  };

  Share.prototype.setup = function setup() {
    var that = this;
    var df = [];

    $.each(that.data, function (key, val) {
      that.api_url = val.api_url;
      that.send_data[val.param_name] = that.site_url;
      df.push(that.getCount());
    });

    $.when.apply($, df).done(function () {
      return that.view(arguments);
    });
  };

  Share.prototype.checkCache = function checkCache() {
    var cache = JSON.parse(localStorage.getItem('sc_' + this.site_url)) || null;
    var currentTime = new Date().getTime();

    if (cache && currentTime - cache.saveTime < this.conf.cacheTime) {
      this.data.facebook.count = cache.fbCount;
      this.data.hatena.count = cache.hbCount;
      return this.render();
    }
    return this.setup();
  };

  Share.prototype.init = function init() {
    this.site_url = this.$element.attr('title');
    this.conf = $.extend({}, this.defaults, this.options);
    this.checkCache();
    return this;
  };

  $.fn.cbShareCount = function (options) {
    return this.each(function (i) {
      new Share(this, i, options).init();
    });
  };
}));
