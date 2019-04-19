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
