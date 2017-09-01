/**
* Display
*/

"use strict";

function Display() {
  let canvas;
  let context;

  let width = 0; // Total width of display (playground)
  let height = 0; // Total height of display (playground)

  // Translations settings (camera movement)
  let x_next_translate = 0;
  let y_next_translate = 0;
  let x_translate = 0;
  let y_translate = 0;
  let camera_speed = 4;
  let boost = false;
  let boost_coeff = 4;

  //Border settings
  let border_width = 6;
  let border_color = "black";

  // Background settings
  let background_color = "#d8d6d6";

  /**
  * Clear the whole canvas
  */
  function clear() {
    context.clearRect(0-x_translate, 0-y_translate, width+x_translate+border_width+2, height+y_translate+border_width+2);
  }

  /**
  * Draw border around the hexagon grid
  */
  function drawBorder() {
    context.lineWidth = border_width;
    context.strokeStyle = border_color;
    context.strokeRect(0, 0, width, height);
  }

  function drawBackground() {
    context.fillStyle = background_color;
    context.fillRect(0,0,width,height);
  }

  function getCameraSpeed() {
    if (boost) {
      boost = false;
      return camera_speed*boost_coeff;
    } else {
      return camera_speed;
    }
  }

  /**
  * Draw all the elements
  */
  function draw() {
    clear();
    drawBackground();
    //drawBorder();
  }

  /**
  * Translate the playground
  */
  function translate() {
    x_translate += x_next_translate;
    y_translate += y_next_translate;
    context.translate(x_next_translate, y_next_translate);
    x_next_translate=0;
    y_next_translate=0;
  }

  return {
    init: function(pWidth, pHeight, pBorderWidth) {
      canvas = document.getElementById("display");
      context = canvas.getContext("2d");
      width = pWidth;
      height = pHeight;
      border_width = pBorderWidth;
    },

    resize: function() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    /**
    * Draw a hexagon in the chanvas
    */
    drawHexagon: function(pHexagonCenter, pHexagon, pColor, pFill) {
      let color = pColor;
      let fill = pFill;

      let centerX = pHexagonCenter.getX();
      let centerY = pHexagonCenter.getY();

      context.beginPath();
      context.moveTo(centerX+pHexagon.getCorner(0).getX() , centerY+pHexagon.getCorner(0).getY()); // First corner
      context.lineTo(centerX+pHexagon.getCorner(1).getX() , centerY+pHexagon.getCorner(1).getY()); // Second corner
      context.lineTo(centerX+pHexagon.getCorner(2).getX() , centerY+pHexagon.getCorner(2).getY()); // Third corner
      context.lineTo(centerX+pHexagon.getCorner(3).getX() , centerY+pHexagon.getCorner(3).getY()); // Fourth corner
      context.lineTo(centerX+pHexagon.getCorner(4).getX() , centerY+pHexagon.getCorner(4).getY()); // Fifth corner
      context.lineTo(centerX+pHexagon.getCorner(5).getX() , centerY+pHexagon.getCorner(5).getY());
      context.closePath();

      context.lineWidth = 2;

      //Background
      context.fillStyle = color;
      context.fill();

      // Border
      context.strokeStyle = "#34373d";
      context.stroke();

    },
    moveCameraUp: function() {
      if (y_translate<0) {
        y_next_translate = getCameraSpeed();
        translate();
      }
    },
    moveCameraDown: function() {
      if(Math.abs(y_translate)+canvas.height<height) {
        y_next_translate = -getCameraSpeed();
        translate();
      }
    },
    moveCameraLeft: function() {
      if(x_translate<0) {
        x_next_translate = getCameraSpeed();
        translate();
      }
    },
    moveCameraRight: function() {
      if(Math.abs(x_translate)+canvas.width<width) {
        x_next_translate = -getCameraSpeed();
        translate();
      }
    },
    speedUp: function() {
      boost = true;
    },
    draw: function() {
      draw();
    },
    clear: function() {
      clear();
    }
  };
}
