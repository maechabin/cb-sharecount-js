/*!
 * jquery.cbsharecount.js v1.2.1
 * Auther @maechabin
 * Licensed under mit license
 * https://github.com/maechabin/jquery.cb-share-count.js
 */
;((factory) => {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'), window);
  } else {
    factory(jQuery, window);
  }
})(($, window) => {
  class Share {

    constructor(element, i, options) {
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
      };
      this.data = {
        facebook: {
          api_url: 'http://graph.facebook.com/',
          param_name: 'id',
          count: 0,
        },
        hatena: {
          api_url: 'http://api.b.st-hatena.com/entry.count',
          param_name: 'url',
          count: 0,
        },
      };
    }

    getCount() {
      const d = new $.Deferred();

      $.ajax({
        type: 'get',
        url: this.api_url,
        cache: true,
        dataType: 'jsonp',
        data: this.send_data,
        success: d.resolve,
        error: d.reject,
      });
      return d.promise();
    }

    view(arg) {
      const that = this;
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

    render() {
      const fb = $('.cb-fb').eq(this.num).find('span');
      const hb = $('.cb-hb').eq(this.num).find('span');
      fb.html(this.data.facebook.count);
      hb.html(this.data.hatena.count);
    }

    save() {
      localStorage.setItem(`sc_${this.site_url}`, JSON.stringify({
        fb: this.data.facebook.count,
        hb: this.data.hatena.count,
        saveTime: new Date().getTime(),
      }));
      localStorage.setItem('cbsharecount', new Date().getTime());
    }

    setup() {
      const that = this;
      const df = [];

      $.each(this.data, (key, val) => {
        this.api_url = val.api_url;
        this.send_data[val.param_name] = this.site_url;
        df.push(this.getCount());
      });

      $.when.apply($, df).done(function () {
        return that.view(arguments);
      });
    }

    checkCache() {
      let cache;
      let currentTime;

      if (('localStorage' in window) && (window.localStorage !== null)) {
        cache = JSON.parse(localStorage.getItem(`sc_${this.site_url}`)) || null;
        currentTime = new Date().getTime();

        if (cache && currentTime - cache.saveTime < this.conf.cacheTime) {
          this.data.facebook.count = cache.fb;
          this.data.hatena.count = cache.hb;
          return this.render();
        }
      }
      return this.setup();
    }

    init() {
      this.site_url = this.$element.attr('title');
      this.conf = $.extend({}, this.defaults, this.options);
      if (this.conf.cache) {
        this.checkCache();
      } else {
        this.setup();
      }
      return this;
    }
  }

  $.fn.cbShareCount = function (options) {
    let lastSaveTime;
    const storage = window.localStorage || null;
    const cacheTime = options.cacheTime || 86400000;
    const currentTime = new Date().getTime();
    if (('localStorage' in window) && (storage !== null)) {
      lastSaveTime = JSON.parse(localStorage.getItem('cbsharecount')) || null;
      if (lastSaveTime && currentTime - lastSaveTime > cacheTime) {
        Object.keys(storage).map((key) => {
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
