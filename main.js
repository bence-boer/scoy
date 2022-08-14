const spans = document.getElementsByTagName("span");
const cursor = document.getElementById("cursor");
const IS_TOUCH_DEVICE = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
const ANIMATION_RANGE = 200;

let offset_vector = {
  x: 0,
  y: 0
};
let scale = 1;
let rect, distance;
let mouseX, mouseY;

process_touchmove = (touch_event) => {
  touch_event.preventDefault();
  let touch = touch_event.targetTouches[0];
  handleMovement(touch);
}

// Register touch event handlers
handleMovement = (input) => {
  mouseX = input.clientX;
  mouseY = input.clientY;

  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";

  for(letter of spans){
    rect = letter.getBoundingClientRect();
    distance = dist(mouseX, mouseY, (rect.left+rect.right)/2, (rect.top+rect.bottom)/2);

    offset_vector.y = map(distance, 0, ANIMATION_RANGE, -0.5, 0);
    scale = map(distance, 0, ANIMATION_RANGE, 1.1, 1);

    letter.style.transform = "translateY("+ offset_vector.y +"em) scale("+ scale +")";
  }
};

window.addEventListener('mousemove', (event) => {
  cursor.style.display = "block";
  cursor.style.left = event.clientX + "px";
  cursor.style.top = event.clientY + "px";
}, { once: true});

if(IS_TOUCH_DEVICE){
  window.addEventListener('touchmove', process_touchmove, false);
}
window.addEventListener('mousemove', handleMovement, false);
document.addEventListener("mouseleave", (event) => {  
  if (event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight)) {  
    cursor.style.display = "none"; 
  }  
});
document.addEventListener("mouseenter", (event) => {  
  if (event.clientY >= 0 && event.clientX >= 0 && event.clientX <= window.innerWidth && event.clientY <= window.innerHeight) {  
    cursor.style.display = "block"; 
  }  
});

function dist(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function map(value, fromFloor, fromCeil, toFloor, toCeil){
  return toFloor + (toCeil - toFloor) * (Math.max(Math.min(value, fromCeil), fromFloor) - fromFloor) / (fromCeil - fromFloor);
}