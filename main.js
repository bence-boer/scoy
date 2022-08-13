const spans = document.getElementsByTagName("span");
const cursor = document.getElementById("cursor");
const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

let cursorPosX = 0, cursorPosY = 0;

const range = 200;
let offset = 0, scale = 1;
let rect, distance;
let mouseX, mouseY;

process_touchmove = (touchEvent) => {
  touchEvent.preventDefault();
  let touch = touchEvent.targetTouches[0];
  handleMovement(touch);
}

// Register touch event handlers
handleMovement = (input) => {
  cursorPosX = input.clientX*0.1 + cursorPosX*0.9;
  cursorPosY = input.clientY*0.1 + cursorPosY*0.9;
  cursor.style.left = cursorPosX + "px";
  cursor.style.top = cursorPosY + "px";

  for(letter of spans){
    rect = letter.getBoundingClientRect();
    distance = dist(cursorPosX, cursorPosY, (rect.left+rect.right)/2, (rect.top+rect.bottom)/2);

    offset = map(distance, 0, range, -0.5, 0);
    scale = map(distance, 0, range, 1.1, 1);


    letter.style.transform = "translateY("+ offset +"em) scale("+ scale +")";
  }
};

if(isTouchDevice){
  window.addEventListener('touchmove', process_touchmove, false);
}
window.addEventListener('mousemove', handleMovement, false);

function dist(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function map(value, fromFloor, fromCeil, toFloor, toCeil){
  return toFloor + (toCeil - toFloor) * (Math.max(Math.min(value, fromCeil), fromFloor) - fromFloor) / (fromCeil - fromFloor);
}
