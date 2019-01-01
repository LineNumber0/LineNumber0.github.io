// {LN_0}
var aplayer = document.getElementById("audplayer"), 
LyricTimes = [],
LyricTarget = document.querySelectorAll("a[id^='lp']:empty"),
windowHeight = window.outerHeight;
aplayer.volume = 0.5;
for (var i = 0; i < LyricTarget.length; i++) {
  LyricTarget[i].style.height = parseInt(windowHeight / 4) + "px";
}
function getStime() {
  return parseInt(aplayer.currentTime);
}
function followLyrics() {
  for (var j = 0; j < LyricTimes.length; j++) {
    switch(getStime()) {
    case LyricTimes[j]: document.location.href = "#lp" + j;
    break;
  }
  }
}
aplayer.addEventListener("timeupdate",followLyrics);