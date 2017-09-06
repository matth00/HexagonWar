/**
* Point
*/

"use strict";

function Point(pX, pY, pZ){
  let x = pX || 0;
  let y = pY || 0;
  let z = pZ || 0;
  return {
    set: function(pX,pY, pZ) {
      x = pX || 0;
      y = pY || 0;
      z = pZ || 0;
    },
    getX: function() {
      return x;
    },
    getY: function() {
      return y;
    },
    getZ: function() {
      return z;
    },
    setX: function(pX) {
      x = pX;
    },
    setY: function(pY) {
      y = pY;
    },
    setZ: function(pZ) {
      z = pZ;
    },
    addToX: function(pValue) {
      x += pValue;
    },
    addToY: function(pValue) {
      y += pValue;
    },
    addToZ: function(pValue) {
      z += pValue;
    }
  };
}
