function createDropCaches(mylib){
  'use strict';
  mylib.dropCaches = function () {
    if (!window.__vektrImageDictionary) return;
    window.__vektrImageDictionary.release();
  };
}

module.exports = createDropCaches;
