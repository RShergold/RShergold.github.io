

var lastPOS;
var currentDeg = 0;
var front = document.getElementById('front');
var back = document.getElementById('back');

window.ontouchstart = function(event) {
  lastPOS = event.changedTouches[0];
};
window.addEventListener('touchmove', function(event) {
  event.preventDefault();
  var thisPOS = event.changedTouches[0];
  var movement = {
    x: thisPOS.screenX - lastPOS.screenX,
    y: thisPOS.screenY - lastPOS.screenY
  };
  lastPOS = thisPOS;
  var min = Math.min(movement.x, movement.y);
  var max = Math.max(movement.x, movement.y);
  var moveBy = ( Math.abs(min) > Math.abs(max) ) ? min : max;
  currentDeg = Math.min( 180, Math.max( 0, (currentDeg - (moveBy ) ) ));
  front.style.transform = 'rotateY('+(0-currentDeg)+'deg)';
  back.style.transform = 'rotateY('+(180-currentDeg)+'deg)';
}, { passive: false });