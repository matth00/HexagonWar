/**
* Hexagone
* It will compute all numbers related to it :
* - Corners (6) points
* - Width and height
* - Horizontal and vertical distance to next hexagon
*
* The hexagone is vertical
*/

"use strict";

function Hexagon(pSize, pCenter) {
  let corners = [0,0,0,0,0,0]; // Hexagon corners points
  let size = pSize;
  let owner = undefined;
  let cost = undefined;
  let color = "white";
  let text = undefined;
  let width;
  let height;
  let horizontal_distance;
  let vertical_distance;
  let half_horizontal_distance;
  let half_vertical_distance;
  let center = pCenter;


  // Vertical hexagon
  height = pSize*2;
  width = Math.round(Math.sqrt(3)/2*height);
  horizontal_distance = width;
  vertical_distance = Math.round(height * 3/4);

  half_horizontal_distance = Math.round(horizontal_distance/2);
  half_vertical_distance = Math.round(vertical_distance/2);


  function hex_corner(pSize, pCorner) {
    let angle_deg = 60 * pCorner+30; // 30 = rotation to vertical
    let angle_rad = Math.PI / 180 * angle_deg;
    let x = Math.round(pSize * Math.cos(angle_rad));
    let y = Math.round(pSize * Math.sin(angle_rad));
    return Point(center.getX()+x,center.getY()+y);
  }

  corners[0] = hex_corner(pSize, 0);
  corners[1] = hex_corner(pSize, 1);
  corners[2] = hex_corner(pSize, 2);
  corners[3] = hex_corner(pSize, 3);
  corners[4] = hex_corner(pSize, 4);
  corners[5] = hex_corner(pSize, 5);

  function axial_to_cube(pAxial) {
    let x = pAxial.getX(); //q
    let z = pAxial.getY(); //r
    let y = -x-z;
    return Point(x,y,z);
  }

  function cube_to_axial(pCube) {
    let q = pCube.getX();
    let r = pCube.getZ();
    return Point(q,r);
  }

  function cube_round(pCube) {
    let rx = Math.round(pCube.getX());
    let ry = Math.round(pCube.getY());
    let rz = Math.round(pCube.getZ());

    let x_diff = Math.abs(rx - pCube.getX());
    let y_diff = Math.abs(ry - pCube.getY());
    let z_diff = Math.abs(rz - pCube.getZ());

    if (x_diff > y_diff && x_diff > z_diff) {
      rx = -ry-rz;
    } else if (y_diff > z_diff) {
        ry = -rx-rz;
    } else {
        rz = -rx-ry;
    }

    return Point(rx, ry, rz);
  }

  function hex_round(pAxial) {
    return cube_to_axial(cube_round(axial_to_cube(pAxial)));
  }

  // oddr
  function cube_to_offset(pCube) {
    let col =  pCube.getX() + ( pCube.getZ() - ( pCube.getZ()&1)) / 2;
    let row = pCube.getZ();
    return Point(col, row);
  }

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
    },
    getSize: function() {
      return size;
    },
    getIndexFromPixel: function(pPixel) {
      let q = (pPixel.getX() * Math.sqrt(3)/3 - pPixel.getY() / 3) / size;
      let r = pPixel.getY() * 2/3 / size;
      let axial = hex_round(Point(q,r));
      let cube = axial_to_cube(axial);
      let offset = cube_to_offset(cube);

      return offset;
    },
    getOwner: function() {
      return owner;
    },
    setOwner: function(pOwner) {
     owner = pOwner;
   },
   getCost: function() {
     return cost;
   },
   setCost: function(pCost) {
     cost = pCost;
   },
   getColor: function(pColor) {
     return color;
   },
   setColor: function(pColor) {
     color = pColor;
   },
   getCenter: function() {
     return center;
   },
   getText: function() {
     return text;
   },
   setText: function(pText) {
     text = pText;
   }
  };
}
