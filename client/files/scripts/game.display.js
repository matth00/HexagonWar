/**
* Display
*/

"use strict";

function Display() {
  let canvas_playground;
  let playground;

  let canvas_score;
  let score;
  let canvas_minimap;

  let width = 0; // Total width of display (playground)
  let height = 0; // Total height of display (playground)

  // Translations settings (camera movement)
  let x_next_translate = 0;
  let y_next_translate = 0;
  let x_translate = 0;
  let y_translate = 0;
  let camera_speed = 4;
  let boost = false; // Boost enabled
  let boost_coeff = 4; // Boost speed = camera_speed*boost_coeff

  // Playground settins

  //Border settings
  let border_width = 6;
  let border_color = "black";

  // Background settings
  let background_color = "#d8d6d6";

  let hexagon_border_size = 2;
  let hexagon_border_color = "#34373d";
  let hexagon_text_color = "#34373d";

  let hexagon = undefined;

  /**
  * Clear the whole canvas
  */
  function clear() {
    playground.clearRect(0-x_translate, 0-y_translate, width+x_translate+border_width+2, height+y_translate+border_width+2);
  }

  /**
  * Draw border around the hexagon grid
  */
  function drawBorder() {
    playground.lineWidth = border_width;
    playground.strokeStyle = border_color;
    playground.strokeRect(0, 0, width, height);
  }

  function drawBackground() {
    playground.fillStyle = background_color;
    playground.fillRect(0,0,width,height);
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
    playground.translate(x_next_translate, y_next_translate);
    x_next_translate=0;
    y_next_translate=0;
  }

  return {
    init: function(pWidth, pHeight, pBorderWidth) {
      canvas_playground = document.getElementById("playground");
      playground = canvas_playground.getContext("2d");
      width = pWidth;
      height = pHeight;
      border_width = pBorderWidth;

      canvas_score = document.getElementById("score");
      score = canvas_score.getContext("2d");

    },
    resize: function() {
      canvas_playground.width  = window.innerWidth-150;
      canvas_playground.height = window.innerHeight;
    },
    setHexagon: function(pHexagon) {
      hexagon = pHexagon;
    },
    /**
    * Draw a hexagon in the chanvas
    */
    drawHexagon: function(pHexagon) {

      playground.beginPath();
      playground.moveTo(pHexagon.getCorner(0).getX(), pHexagon.getCorner(0).getY()); // First corner
      playground.lineTo(pHexagon.getCorner(1).getX(), pHexagon.getCorner(1).getY()); // Second corner
      playground.lineTo(pHexagon.getCorner(2).getX(), pHexagon.getCorner(2).getY()); // Third corner
      playground.lineTo(pHexagon.getCorner(3).getX(), pHexagon.getCorner(3).getY()); // Fourth corner
      playground.lineTo(pHexagon.getCorner(4).getX(), pHexagon.getCorner(4).getY()); // Fifth corner
      playground.lineTo(pHexagon.getCorner(5).getX(), pHexagon.getCorner(5).getY());
      playground.closePath();

      //Background
      playground.fillStyle = pHexagon.getColor();
      playground.fill();

      // Border
      playground.lineWidth = hexagon_border_size;
      playground.strokeStyle = hexagon_border_color;
      playground.stroke();

      // Text
      if (pHexagon.getText() !== undefined) {
        playground.font = "20px Arial";
        playground.fillStyle = hexagon_text_color;
        playground.textAlign = "center";
        playground.fillText(pHexagon.getText(), pHexagon.getCenter().getX(), pHexagon.getCenter().getY()+8);
      }

    },
    moveCameraUp: function() {
      if (y_translate<0) {
        y_next_translate = getCameraSpeed();
        translate();
      }
    },
    moveCameraDown: function() {
      if(Math.abs(y_translate)+canvas_playground.height<height) {
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
      if(Math.abs(x_translate)+canvas_playground.width<width) {
        x_next_translate = -getCameraSpeed();
        translate();
      }
    },
    speedUp: function() {
      boost = true;
    },
    getPlaygroundMousePosition: function(pMousePosition) {
      return Point(pMousePosition.getX()-x_translate, pMousePosition.getY()-y_translate);
    },
    getScreenWidth: function() {
      return canvas_playground.width;
    },
    getScreenHeight: function() {
      return canvas_playground.height;
    },
    draw: function() {
      draw();
    },
    drawScore: function(pIdPlayer,pPlayers,pPlaygroundCases) {
      // Background
      canvas_score.width  = 150;
      canvas_score.height = canvas_playground.height;
      score.fillStyle = "#34373d";
      score.rect(0,0,canvas_score.width,canvas_score.height);
      score.fill();

      //Player
      score.beginPath();
      score.fillStyle = pPlayers[pIdPlayer].color;
      score.arc(75,40,30,0,2*Math.PI);
      score.fill();

      score.fillStyle = "white";
      score.font = "25px Arial";
      score.fillText(pPlayers[pIdPlayer].name,10,100);

      score.font = "18px Arial";
      score.fillText("Cases : "+pPlayers[pIdPlayer].nbCellsOwned,10,130);
      let territory_player = (100*pPlayers[pIdPlayer].nbCellsOwned/pPlaygroundCases);
      score.fillText("Teritory : "+territory_player.toFixed(1)+"%",10,150);
      score.fillText("Points : "+pPlayers[pIdPlayer].points,10,170);


      score.font = "20px Arial";
      score.textAlign = "center";
      score.fillText("Players",75,250);

      //Others players

      score.textAlign = "left";
      score.font = "14px Arial";


      pPlayers.forEach(function(player,index) {
        if (player === undefined || player === null) {
          return;
        }
        score.beginPath();
        score.fillStyle = player.color;
        score.arc(12,275+25*index,10,0,2*Math.PI);
        score.fill();

        score.fillStyle = "white";
        let territory = (100*player.nbCellsOwned/pPlaygroundCases);
        score.fillText(territory.toFixed(1)+"% "+player.name,26,281+25*index);
      });

    },
    clear: function() {
      clear();
    }
  };
}
