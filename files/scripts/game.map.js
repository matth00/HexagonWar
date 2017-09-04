/**
* Map
*/

"use strict";

function Map() {
  let width = 0;
  let height = 0;
  let map = [];

  return {
    createEmptyMap: function(pWidth, pHeight) {
      width = pWidth;
      height = pHeight;
      while(map.push([]) < pHeight);
      map = new Array(pHeight);
      map.forEach(function(element) {
        while(element.push([0]) < pWidth);
      });
      return map;
    },
    setCase: function(pLine, pColumn, pId) {
      map[pLine][pColumn] = pId;
    },
    getCase: function(pLine, pColumn) {
      return map[pLine][pColumn];
    },
    getMap: function () {
      return map;
    },
    getWidth: function() {
      return width;
    },
    getHeight: function() {
      return height;
    }
  };
}
