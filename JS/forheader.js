﻿// First wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function(){
	// This function merely toggles the class
	function a() {
		document.querySelector('body').classList.toggle('OffCanvas-Active');          // assign "OffCanvas" class name to the "body" element {LN0 comment only}
	}
	// When the header is clicked we fire the function to toggle the class
	document.querySelector('.Header').addEventListener('click', a );

	// This debounce function (via: https://remysharp.com/2010/07/21/throttling-function-calls) merely stops functioned firing too often on repetitive events (such as resize/scroll)
	function debounce(fn, delay) {
		var timer = null;
		return function () {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(context, args);
			}, delay);
		};
	}

	// removing the class from the body inside a debounce
	var debouncedA = debounce(function() {
		document.querySelector('body').classList.remove('OffCanvas-Active');
	}, 250);

	// When the window is resized, we want to fire the debouncedA function
	window.onresize = debouncedA;
});