(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var lr = ALLEX.execSuite.libRegistry;
lr.register('vektr_utillib',
  require('./index')(
    ALLEX
  )
);

},{"./index":2}],2:[function(require,module,exports){
function createLib (execlib) {
  'use strict';

  var lib = execlib.lib;
  var ret = {};

  require('./src/misccreator')(ret);
  require('./src/spriterenderingconstraintscreator')(ret);
  require('./src/svgutilscreator')(lib, ret);
  require('./src/logcreator')(ret);
  require('./src/dropcachescreator')(ret);

  return ret;
}

module.exports = createLib;

},{"./src/dropcachescreator":3,"./src/logcreator":4,"./src/misccreator":5,"./src/spriterenderingconstraintscreator":6,"./src/svgutilscreator":7}],3:[function(require,module,exports){
function createDropCaches(mylib){
  'use strict';
  mylib.dropCaches = function () {
    if (!window.__vektrImageDictionary) return;
    window.__vektrImageDictionary.release();
  };
}

module.exports = createDropCaches;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
function createSpriteRenderingConstraints(mylib) {
  'use strict';
  function SpriteRenderingConstraints (available, valign, halign) {
    this.pos = available.pos.slice();
    this.dimensions = available.dimensions.slice();
    this.valign = valign || SpriteRenderingConstraints.VALIGN_TOP;
    this.halign = halign || SpriteRenderingConstraints.HALIGN_LEFT;
    this.rar = this.dimensions[0]/this.dimensions[1];
  }

  SpriteRenderingConstraints.prototype.destroy = function () {
    this.pos = null;
    this.dimensions = null;
    this.valign = null;
    this.halign = null;
    this.rar = null;
  };

  SpriteRenderingConstraints.prototype.calculate = function (dimensions, pos) {
    pos[0] = this.pos[0]; pos[1] = this.pos[1];
    var w = dimensions[0], h = dimensions[1], car = w/h, rar = this.rar;
    if (car > rar) {
      dimensions[0] = this.dimensions[0];
      dimensions[1] = dimensions[0]/car;
      //height affected, reposition height ...
      switch(this.valign) {
        //NOT TESTED YET ...
        case SpriteRenderingConstraints.VALIGN_TOP: return;
        case SpriteRenderingConstraints.VALIGN_BOTTOM: {
          pos[1] += (this.dimensions[1] - dimensions[1]);
          return;
        }
        case SpriteRenderingConstraints.VALIGN_CENTER: {
          pos[1] += ((this.dimensions[1] - dimensions[1])/2);
          return;
        }
      }
    }else{
      dimensions[1] = this.dimensions[1];
      dimensions[0] = dimensions[1]*car;
      ///width affected, reposition width
      switch (this.halign) {
        case SpriteRenderingConstraints.HALIGN_LEFT: return;
        case SpriteRenderingConstraints.HALIGN_RIGHT: {
          pos[0] += (this.dimensions[0] - dimensions[0]);
          return;
        }
        case SpriteRenderingConstraints.HALIGN_CENTER: {
          pos[0] += (this.dimensions[0] - dimensions[0])/2;
          return;
        }
      }
    }
  };

  SpriteRenderingConstraints.VALIGN_BOTTOM = 1;
  SpriteRenderingConstraints.VALIGN_CENTER = 2;
  SpriteRenderingConstraints.VALIGN_TOP = 3;
  SpriteRenderingConstraints.HALIGN_RIGHT = 1;
  SpriteRenderingConstraints.HALIGN_CENTER = 2;
  SpriteRenderingConstraints.HALIGN_LEFT = 3;


  mylib.SpriteRenderingConstraints  = SpriteRenderingConstraints;
}

module.exports = createSpriteRenderingConstraints;

},{}],7:[function(require,module,exports){
function createSVGUtils(lib,mylib){
  'use strict';
  function linkText(text){
    if(text.charAt(0)==='"'){
      return text.slice(2,text.length-1);
    }else{
      return text.slice(1);
    }
  }
  mylib.colorOrLink = function(style,valname,opacityvalname,noncolorlinkcb){
    if(!style){return;}
    var val = ('function' === typeof style.getPropertyValue) ? style.getPropertyValue(valname) : style[valname];
    if(!val){
      return;
    }
    if('undefined' !== typeof val.value){
      val = val.value;
    }
    if(typeof val !== 'string'){return;}
    if(val.length<1){return;}
    if(val==='none'){return 'none';}
    var color = '', colornum,ind;
    if(val.charAt(0)==='#'){
      //console.log(val);
      colornum = parseInt(val.substr(1),16);
      if(isNaN(colornum)){
        if(lib.isFunction(noncolorlinkcb)){
          noncolorlinkcb(val.substr(1));
        }
        return;
      }
      //console.log(colornum);
      color += colornum&0xff;
      color = ','+color;
      colornum >>>= 8;
      color = (colornum&0xff)+color;
      color = ','+color;
      colornum >>>= 8;
      color = (colornum&0xff)+color;
    }else{
      ind = val.indexOf('url(');
      if(ind>=0){
        if(lib.isFunction(noncolorlinkcb)){
          noncolorlinkcb(linkText(val.substring(ind+4,val.indexOf(')'))));
        }
        return;
      }
      ind = val.indexOf('rgb(');
      if(ind>=0){
        color = val.substring(ind+4,val.indexOf(')'));
      }
    }
    if(color){
      opacityvalname = opacityvalname || valname+'-opacity';
      var op = parseFloat(('function' === typeof style.getPropertyValue) ? style.getPropertyValue(opacityvalname) : style[opacityvalname]);
      if(!isNaN(op)){
        color = 'rgba('+color+','+op+')';
      }else{
        color = 'rgb('+color+')';
      }
    }
    return color;
  };
  mylib.resolveStyle = function(style,cssattrib){
    var color = mylib.colorOrLink(style,cssattrib,null,this.__parent.onResolveNeeded.bind(this.__parent,this,cssattrib));
    if(color){
      this.style[cssattrib] = color;
    }
  };
  mylib.readTransform = function(tr){
    if(!(tr&&tr.baseVal)){return null;}
    var ctr = tr.baseVal.consolidate();
    if(!ctr){return [1,0,0,1,0,0];}
    var ctm;
    if(typeof ctr === 'object' && ctr instanceof Array){
      ctm = ctr[0].matrix;
    }else{
      ctm = ctr.matrix;
    }
    return [ctm.a,ctm.b,ctm.c,ctm.d,ctm.e,ctm.f];
  };
  mylib.readSVGUseLink = function(al){
    var ret = mylib.readSVGAnimatedString(al);
    if(typeof ret === 'string'){
      if(ret.charAt(0)==='#'){
        ret = ret.substring(1);
      }
    }
    return ret;
  };
  mylib.readSVGAnimatedString = function(al){
    if(!al||typeof al.baseVal === 'undefined'){return null;}
    return al.baseVal;
  };
  mylib.readSVGAnimatedNumber = function(al){
    if(!al||typeof al.baseVal === 'undefined'){return null;}
    return al.baseVal;
  };
  mylib.readSVGAnimatedLength = function(al){
    if(!al||typeof al.baseVal === 'undefined'){return null;}
    if(al.baseVal instanceof SVGLength){
      return al.baseVal.value;
    }
    if(al.baseVal instanceof SVGLengthList){
      if(!al.baseVal.numberOfItems){return null;}
      return al.baseVal.getItem(0).value;
    }
  };
  mylib.traverseSvgCollection = function(coll,cb){
    return mylib.traverseCollection(coll,cb,'numberOfItems','getItem');
  };
}

module.exports = createSVGUtils;

},{}]},{},[1]);
