/**
* Point
*/

"use strict";

function Point(pX, pY){
  let x = pX || 0;
  let y = pY || 0;
  return {
    getX: function() {
      return x;
    },
    getY: function() {
      return y;
    },
    set: function(pX,pY) {
      x = pX;
      y = pY;
    },
    setX: function(pX) {
      x = pX;
    },
    setY: function(pY) {
      y = pY;
    }
  };
}
