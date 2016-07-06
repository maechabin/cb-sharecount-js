/*!
 * jquery.cbsharecount.js v2.0.0
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
  class ShareCount {

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
      this.count = {
        fb: 0,
        hb: 0,
        tw: 0,
        pk: 0,
      };
    }

    setParam(url) {
      const json = {
        facebook: {
          api_url: 'https://graph.facebook.com/',
          param: {
            id: url,
          },
        },
        hatena: {
          api_url: 'http://api.b.st-hatena.com/entry.count',
          param: {
            url,
          },
        },
        twitter: {
          api_url: 'https://jsoon.digitiminimi.com/twitter/count.json',
          param: {
            url,
          },
        },
        pocket: {
          api_url: 'http://query.yahooapis.com/v1/public/yql',
          param: {
            q: 'SELECT content FROM data.headers WHERE url="https://widgets.getpocket.com/v1/button?label=pocket&count=vertical&v=1&url=' + url + '"',
            format: 'xml',
            env: 'http://datatables.org/alltables.env',
          },
        },
      };
      return json;
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

    takeCount(arg) {
      const that = this;
      console.log(arg);
      $(arg).each(function (i) {
        switch (i) {
          case 0:
            that.count.fb = this[0].shares || this[0].likes || 0;
            break;
          case 1:
            that.count.hb = this[0] || 0;
            break;
          case 2:
            that.count.tw = this[0].count || 0;
            break;
          case 3:
            if (this[0].results) {
              const content = this[0].results.toString();
              const match = content.match(/&lt;em id="cnt"&gt;(\d+)&lt;\/em&gt;/i);
              that.count.pk = (match != null) ? match[1] : 0;
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

    setup() {
      const that = this;
      const df = [];
      const data = that.setParam(that.site_url);
      $.each(data, (key, val) => {
        this.api_url = val.api_url;
        this.send_data = val.param;
        df.push(this.getCount());
      });

      $.when.apply($, df).done(function () {
        return that.takeCount(arguments);
      });
    }

    render() {
      const fb = $('.cb-fb').eq(this.num).find('span');
      const hb = $('.cb-hb').eq(this.num).find('span');
      const tw = $('.cb-tw').eq(this.num).find('span');
      const pk = $('.cb-pk').eq(this.num).find('span');
      fb.html(this.count.fb);
      hb.html(this.count.hb);
      tw.html(this.count.tw);
      pk.html(this.count.pk);
    }

    save() {
      localStorage.setItem(`sc_${this.site_url}`, JSON.stringify({
        fb: this.count.fb,
        hb: this.count.hb,
        tw: this.count.tw,
        pk: this.count.pk,
        saveTime: new Date().getTime(),
      }));
      localStorage.setItem('cbsharecount', new Date().getTime());
    }

    checkCache() {
      let cache;
      let currentTime;

      if (('localStorage' in window) && (window.localStorage !== null)) {
        cache = JSON.parse(localStorage.getItem(`sc_${this.site_url}`)) || null;
        currentTime = new Date().getTime();

        if (cache && currentTime - cache.saveTime < this.conf.cacheTime) {
          this.count.fb = cache.fb;
          this.count.hb = cache.hb;
          this.count.tw = cache.tw;
          this.count.pk = cache.pk;
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

  $.fn.cbShareCount = function cbShareCount(options) {
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

    return this.each(function shareCount(i) {
      new ShareCount(this, i, options).init();
    });
  };
});
