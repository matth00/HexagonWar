/**
* Input
* Mouse & Keyboard
*/

"use strict";

function Input() {
  let key_state = {};

  let mouse_position = Point(0,0);

  let mouse_click = false;
  let mouse_click_position = Point(0,0);

  let mouse_double_click = false;
  let mouse_double_click_position = Point(0,0);

  return {
      setKeyState: function(pKey,pState) {
          key_state[pKey] = pState;
      },
      getKeyState: function(pKey) {
          return key_state[pKey];
      },
      setMousePosition: function(pX,pY) {
          mouse_position.set(pX,pY);
          //console.log("Mouse position : "+pX+";"+pY+"");
      },
      getMousePosition: function() {
          return mouse_position;
      },
      setMouseClick: function() {
          mouse_click = true;
          mouse_click_position.set(mouse_position.getX(),mouse_position.getY());
          //console.log("Click");
      },
      getMouseClickPosition: function() {
          return mouse_click_position;
      },
      clearMouseClick: function () {
          mouse_click = false;
      },
      setDoubleMouseClick: function() {
          mouse_double_click = true;
          mouse_double_click_position.set(mouse_position.getX(),mouse_position.getY());
          //console.log("Double click");
      },
      getMouseDoubleClickPosition: function() {
          return mouse_double_click_position;
      },
      clearDoubleMouseClick: function() {
          mouse_double_click = false;
      }
  };
}
