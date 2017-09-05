/**
* Input
* Mouse & Keyboard
*/

"use strict";

function Input() {
  let key_state = {};

  let mouse_position = Point(0,0);

  let mouse_click = false; //
  let mouse_click_position = Point(0,0);

  let mouse_double_click = false;
  let mouse_double_click_position = Point(0,0);

  return {
      /**********************
      * Keyboard
      ***********************/

      /**
      * Set the key state
      */
      setKeyState: function(pKey,pState) {
          key_state[pKey] = pState;
      },
      /**
      * Get the key state
      */
      getKeyState: function(pKey) {
          return key_state[pKey];
      },

      /**********************
      * Mouse Positioon
      ***********************/

      /**
      * Set the mouse position
      */
      setMousePosition: function(pX,pY) {
          mouse_position.set(pX,pY);
      },
      /**
      * Get the mouse position (Point)
      */
      getMousePosition: function() {
          return mouse_position;
      },

      /**********************
      * Mouse Click
      ***********************/

      /**
      * Set the mouse click flag to true
      */
      setMouseClick: function() {
          mouse_click = true;
          mouse_click_position.set(mouse_position.getX(),mouse_position.getY());
      },
      /**
      * Get the mouse click flag
      */
      isMouseClicked: function() {
        return mouse_click;
      },
      /**
      * Set the mouse click flag to false
      */
      clearMouseClick: function () {
          mouse_click = false;
      },
      /**
      * Get the mouse click position (Point)
      */
      getMouseClickPosition: function() {
          return mouse_click_position;
      },

      /**********************
      * Mouse double click
      ***********************/

      /**
      * Set the double mouse click flag to true
      */
      setDoubleMouseClick: function() {
          mouse_double_click = true;
          mouse_double_click_position.set(mouse_position.getX(),mouse_position.getY());
      },
      /**
      * Get the double mouse click flag
      */
      isMouseDoubleClicked: function() {
        return mouse_double_click;
      },
      /**
      * Set the double mouse click flag to false
      */
      clearDoubleMouseClick: function() {
          mouse_double_click = false;
      },
      /**
      * Get the double click mouse position (Point)
      */
      getMouseDoubleClickPosition: function() {
          return mouse_double_click_position;
      }
  };
}
