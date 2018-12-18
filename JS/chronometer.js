// {LN_0}												// JavaScript Chronometer from proglogic.com
var startTime = 0
var start = 0
var end = 0
var diff = 0
var timerID = 0

function chrono(){
  end = new Date()
  diff = end - start
  diff = new Date(diff)
  var msec = diff.getMilliseconds()
  var sec = diff.getSeconds()
  var min = diff.getMinutes()
  var hr = diff.getHours()
  if (navigator.userAgent.indexOf("WebKit") != -1) {							// {LN0}
    hr = diff.getHours() - 1
  }
  if (min < 10){
    min = "0" + min
  }
  if (sec < 10){
    sec = "0" + sec
  }
  if(msec < 10){
    msec = "00" +msec
  }
  else if(msec < 100){
    msec = "0" +msec
  }
  document.getElementById("chronotime").innerHTML = hr + ":" + min + ":" + sec + ":" + msec
  timerID = setTimeout("chrono()", 10)
}
function chronoStart(){
  document.chronoForm.startstop.value = "Stop!"
  document.chronoForm.startstop.onclick = chronoStop
  document.chronoForm.reset.onclick = chronoReset
  start = new Date()
  chrono()
  lowbattery()
}
function chronoContinue(){
  document.chronoForm.startstop.value = "Stop!"
  document.chronoForm.startstop.onclick = chronoStop
  document.chronoForm.reset.onclick = chronoReset
  start = new Date()-diff
  start = new Date(start)
  chrono()
  lowbattery()
}
function chronoReset(){
  document.getElementById("chronotime").innerHTML = "00:00:00:000"
  start = new Date()
}
function chronoStopReset(){
  document.getElementById("chronotime").innerHTML = "00:00:00:000"
  document.chronoForm.startstop.onclick = chronoStart
  document.chronoForm.startstop.value = "Start!";							// {LN0}
  chronotime.className = "recvolt";
}
function chronoStop(){
  document.chronoForm.startstop.value = "Start!"
  document.chronoForm.startstop.onclick = chronoContinue
  document.chronoForm.reset.onclick = chronoStopReset
  clearTimeout(timerID)
  if (parseInt(chronotime.innerHTML.substring(chronotime.innerHTML.length - 3)) > 0 ) {			// {LN0}
    document.chronoForm.startstop.value = "Resume!";
    chronotime.className = "recvolt";
  }
}

function lowbattery() {											// {LN0}
if ("transition" in document.body.style) {
  chronotime.className = "lowbattery";
}
}