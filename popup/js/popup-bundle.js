/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var myHistory = document.getElementById('topmatch');
	
	myHistory.innerHTML = "This will be your top match";
	
	myHistory.addEventListener("click", function (event) {
	  console.log(event.target.href);
	  chrome.tabs.create({ url: event.target.href });
	});
	
	function getUrl(callback) {
	  var queryInfo = {
	    active: true,
	    currentWindow: true
	  };
	
	  chrome.tabs.query(queryInfo, function (tabs) {
	    console.log(tabs[0]);
	    console.log(tabs[0].url);
	    console.log(tabs[0].title);
	    callback(tabs[0].url, tabs[0].title);
	  });
	}
	
	getUrl(function (url, title) {
	  document.getElementById('query').innerHTML = title;
	  var terms = title.toLowerCase().split(" ");
	  terms = terms.slice(0, terms.length - 3).join(" ");
	  console.log(terms);
	  console.log("ENCODED", encodeURIComponent(terms));
	
	  $.ajax({
	    type: "GET",
	    url: "http://127.0.0.1:3000/api/search?q=" + encodeURIComponent(terms),
	    success: function success(data) {
	      console.log(data);
	      myHistory.innerHTML = data.success[0]._source.url;
	      myHistory.href = data.success[0]._source.url;
	    }
	  });
	});

/***/ }
/******/ ]);
//# sourceMappingURL=popup-bundle.js.map