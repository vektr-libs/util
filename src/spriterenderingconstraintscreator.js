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
