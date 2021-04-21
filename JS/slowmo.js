// {LN_0}
// a "game" for 5 minutes ! ...							((lpratique b chwiya tbrhish))
if ("animation" in document.body.style) {
var bgaudio = document.getElementById("audplayer"),
bgaudGo = document.getElementById("gobg"),
bgaudStop = document.getElementById("stpbg"),
images = document.images,
list = document.querySelector("ul"),
plbtn = document.getElementById("btn"),
viewPortWidth = document.documentElement.offsetWidth;
if (bgaudio.canPlayType('audio/mp3') != "" && viewPortWidth > 2024) {
  plbtn.style.display = "block";
  btn.onclick = function() {
    bgaudio.volume = 0.5;
    bgaudGo.volume = 0.5;
    bgaudStop.volume = 0.5;
    bgaudio.style.display = "block";
    bgaudio.style.opacity = "0";
    function speedimg() {
      for (var k = 0; k < images.length; k++) {
	if (images[k].style.animationDuration == "1s") {
	  images[k].style.animationDuration = "40s";
	} else {images[k].style.animationDuration = "1s";}
      }
    }
    function restdur() {
      for (var m = 0; m < images.length; m++) {
	images[m].style.animationDuration = "40s";
      }
    }
    bgaudio.addEventListener("play",restdur);
    function plstop() {
      bgaudio.load();
      speedimg();
    }
    function playbg() {
      bgaudGo.play();
      bgaudStop.load();
      speedimg();
      setTimeout(function(){
	bgaudio.play();},1253);
    }
    function stopbg() {
      bgaudStop.play();
      bgaudGo.load();
      setTimeout(plstop,1253);
    }
    list.addEventListener("mouseover",stopbg);
    list.addEventListener("mouseout",playbg);
    window.addEventListener("blur",plstop);
    window.addEventListener("mouseout",plstop);
    
    setTimeout(function(){
      list.removeEventListener("mouseover",stopbg);
      list.removeEventListener("mouseout",playbg);
      window.removeEventListener("blur",plstop);
      window.removeEventListener("mouseout",plstop);
      bgaudio.style.display = "none";
      restdur();
      alert("GAME OVER !");
      console.clear();
      bgaudio.load();
    },300000);
  }
}
}