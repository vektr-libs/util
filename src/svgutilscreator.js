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
