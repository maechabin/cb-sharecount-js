/*!
 * jquery.cbsharecount.js v1.0.2
 * Auther @maechabin
 * Licensed under mit license
 * https://github.com/maechabin/jquery.cb-share-count.js
 */
;(function (factory) {

  if (typeof module === "object" && typeof module.exports === "object") {

    module.exports = factory(require("jquery"), window, document);

  } else {

    factory(jQuery, window, document);

  }

} (function ($, window, document, undefined) {

  "use strict";

  var Share = function (element, i) {

    this.element = element;
    this.$element = $(element);
    this.site_url = "";
    this.api_url = "";
    this.param_name = "";
    this.send_data = {};
    this.num = i;

  };

  Share.prototype.data = {
/*
    twitter: {
      api_url: "http://urls.api.twitter.com/1/urls/count.json",
      param_name: "url",
      count: 0
    },
*/
    facebook: {
      api_url: "http://graph.facebook.com/",
      param_name: "id",
      count: 0
    },

    hatena: {
      api_url: "http://api.b.st-hatena.com/entry.count",
      param_name: "url",
      count: 0
    }

  };

  Share.prototype.get_count = function () {

    var d = new $.Deferred();

    $.ajax({

      type: "get",
      url: this.api_url,
      cache: true,
      dataType: "jsonp",
      data: this.send_data,
      success: d.resolve,
      error: d.reject

    });

    return d.promise();

  };

  Share.prototype.view = function (arg) {

    var that = this;
//    var tw = $(".cb-tw").eq(that.num).find("span");
    var fb = $(".cb-fb").eq(that.num).find("span");
    var hb = $(".cb-hb").eq(that.num).find("span");

    $(arg).each(function (i) {

      switch (i) {
/*
        case 0:
          that.data.twitter.count = this[0].count || "";
          break;
*/
        case 0:
          that.data.facebook.count = this[0].shares || this[0].likes || 0;
          break;

        case 1:
          that.data.hatena.count = this[0] || "";
          break;

      }

    });

//    tw.html(that.data.twitter.count);
    fb.html(that.data.facebook.count);
    hb.html(that.data.hatena.count);

  };

  Share.prototype.setup = function () {

    var that = this;
    var df = [];

    $.each(that.data, function (key, val) {

      that.api_url = val.api_url;
      that.send_data[val.param_name] = that.site_url;
      df.push(that.get_count());

    });

    $.when.apply($, df).done(function () {

      that.view(arguments);

    });

  };

  Share.prototype.init = function () {

    this.site_url = this.$element.attr("title");
    this.setup();

    return this;

  };

  $.fn.cbShareCount = function () {

    return this.each(function (i) {

      new Share(this, i).init();

    });

  };

}));
