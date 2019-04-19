function createLogging(mylib){
  'use strict';
  var _closed=true;
  mylib.openLog = function(){
    _closed=false;
  };
  mylib.closeLog = function(){
    _closed=true;
  };
  mylib.log = function(){
    if(_closed){return;}
    console.log.apply(console,arguments);
  };
}

module.exports = createLogging;
