// {LN_0}
var aplayer = document.getElementById("audplayer"), 
LyricTimes = [],
LyricTarget = document.querySelectorAll("a[id^='lp']:empty"),
LyricElement = document.querySelector("a[id^='lp']:empty+pre");
aplayer.volume = 0.5;
function getStime() {
  return parseInt(aplayer.currentTime);
}
for (var i = 0; i < LyricTarget.length; i++) {
  LyricTarget[i].style.right = parseInt(getComputedStyle(LyricElement).getPropertyValue("width")) / 2 + "px";
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