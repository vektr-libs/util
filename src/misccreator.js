function createMisc(mylib) {
  'use strict';
  function isTouchSupported () {
    if (Modernizr && Modernizr.touch) {
      return Modernizr.touch;
    }
    return 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
  }
  function traverseCollection(coll,cb,lengthpropname,fetchermethod){
    var cursor = 0, len = coll[lengthpropname], fetch = coll[fetchermethod];
    while(cursor<len){
      cb(fetch.call(coll,cursor),cursor);
      cursor++;
    }
  }

  mylib.traverseCollection = traverseCollection;
  mylib.isTouchSupported = isTouchSupported;

}

module.exports = createMisc;
