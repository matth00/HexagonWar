/**
* Map
*/

"use strict";

function Map() {
  let width = 0;
  let height = 0;
  let total_cases = 0;
  let map = [];
  let hexagon_model = undefined;
  let canvas_padding = 0;

  return {
    createEmptyMap: function(pWidth, pHeight, pHexagonModel,pCanvasPadding) {
      hexagon_model = pHexagonModel;
      width = pWidth;
      height = pHeight;
      total_cases = width*height;
      canvas_padding = pCanvasPadding;


      let while_height = 0;
      let while_width = 0;

      let decalage = 0;

      while(while_height < height) {
        map.push([]);
        if (while_height % 2 === 0) {
          decalage = 0;
        } else {
          decalage = hexagon_model.getHorizontalDistance()/2;
        }
        while(while_width < width) {
          let hex_center = Point(canvas_padding+while_width*hexagon_model.getHorizontalDistance()+decalage,canvas_padding+while_height*hexagon_model.getVerticalDistance());
          map[while_height].push(Hexagon(hexagon_model.getSize(),hex_center));
          while_width += 1;
        }
          while_height += 1;
          while_width = 0;
      }

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
    },
    getTotalCases: function() {
      return total_cases;
    },
    isOneNeighborSameOwner: function(pLine, pColumn, pIdOwner) {
      let return_value = false;
      let neighbors = [
        [Point(0,  1), Point( -1, 0), Point(-1, -1), Point(0,  -1), Point(1, -1), Point( 1, 0)],
        [Point(0,  1), Point(-1, 1), Point( -1, 0), Point(0,  -1), Point( 1, 0), Point(1, 1)]];
      let decalage = pLine % 2;

        neighbors[decalage].forEach(function(neighbor) {
          let neighbor_x = pLine+neighbor.getX();
          let neighbor_y = pColumn+neighbor.getY();
          //Check if neighbor is not outside the map
          if (neighbor_x >= 0 && neighbor_x < height && neighbor_y >= 0 && neighbor_y < width) {
            //console.log("Neighbor owner : "+map[neighbor_x][neighbor_y].getOwner());
            if (map[neighbor_x][neighbor_y].getOwner() === pIdOwner) {
              return_value = true;
              return true;
            }
          }
        });
      return return_value;

  }
};
}
