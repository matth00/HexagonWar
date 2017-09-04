/**
* Hexagone
* It will compute all numbers related to it :
* - Corners (6) points
* - Width and height
* - Horizontal and vertical distance to next hexagon
*
* The hexagone can be horizontal (pVertical=false) or vertical (pVertical=true)
*/

"use strict";

function Hexagone(pSize, pVertical) {
  let corners = [0,0,0,0,0,0]; // Hexagon corners points
  let width;
  let height;
  let horizontal_distance;
  let vertical_distance;
  let half_horizontal_distance;
  let half_vertical_distance;

  let hex_corner = function(pSize, pCorner, pVertical) {
    let angle_deg = 60 * pCorner;
    if (pVertical) {
      angle_deg += 30; // Rotation to vertical
    }
    let angle_rad = Math.PI / 180 * angle_deg;
    let x = Math.round(pSize * Math.cos(angle_rad));
    let y = Math.round(pSize * Math.sin(angle_rad));
    return Point(x,y);
  };

  if (pVertical) {
    // Vertical hexagon
    height = pSize*2;
    width = Math.round(Math.sqrt(3)/2*height);
    horizontal_distance = width;
    vertical_distance = Math.round(height * 3/4);
  } else {
    // Horizontal hexagon
    width = pSize*2;
    height = Math.round(Math.sqrt(3)/2*width);
    horizontal_distance = Math.round(width*3/4);
    vertical_distance = height;
  }

  half_horizontal_distance = Math.round(horizontal_distance/2);
  half_vertical_distance = Math.round(vertical_distance/2);

  corners[0] = hex_corner(pSize, 0, pVertical);
  corners[1] = hex_corner(pSize, 1, pVertical);
  corners[2] = hex_corner(pSize, 2, pVertical);
  corners[3] = hex_corner(pSize, 3, pVertical);
  corners[4] = hex_corner(pSize, 4, pVertical);
  corners[5] = hex_corner(pSize, 5, pVertical);

  return {
    getWidth: function() {
      return width;
    },
    getHeight: function() {
      return height;
    },
    getCorner: function(pCornerIndex) {
      return corners[pCornerIndex];
    },
    getCorners: function() {
      return corners;
    },
    getHorizontalDistance : function() {
      return horizontal_distance;
    },
    getVerticalDistance : function() {
      return vertical_distance;
    },
    getHalfHorizontalDistance: function() {
      return half_horizontal_distance;
    },
    getHalfVerticalDistance: function() {
      return half_vertical_distance;
    }
  };
}
