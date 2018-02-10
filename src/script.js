

var lastPOS;
var currentDeg = 0;

window.ontouchstart = function(event) {
  lastPOS = event.changedTouches[0];
}
window.ontouchmove = function(event) {
  event.preventDefault();
  var thisPOS = event.changedTouches[0];
  var movement = {
    x: thisPOS.screenX - lastPOS.screenX,
    y: thisPOS.screenY - lastPOS.screenY
  }
  lastPOS = thisPOS;
  var min = Math.min(movement.x, movement.y);
  var max = Math.max(movement.x, movement.y);
  var moveBy = ( Math.abs(min) > Math.abs(max) ) ? min : max;
  currentDeg = Math.min( 180, Math.max( 0, (currentDeg - (moveBy ) ) ));
  front.style.transform = 'rotateY('+(0-currentDeg)+'deg)';
  back.style.transform = 'rotateY('+(180-currentDeg)+'deg)';
}


;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
