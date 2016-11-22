import jQuery from 'jquery';
import ShareCount from 'ShareCount';

/*!
 * jquery.cbsharecount.js v2.1.0
 * Auther @maechabin
 * Licensed under mit license
 * https://github.com/maechabin/jquery.cb-share-count.js
 */

((factory) => {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'), require('ShareCount'), window);
  } else {
    factory(jQuery, window);
  }
})(($, window) => {
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
