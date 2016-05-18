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
	
	var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 30;
	var oneWeekAgo = new Date().getTime() - microsecondsPerWeek;
	
	var urls = {};
	
	document.getElementById('sendhistory').addEventListener("click", function () {
	  chrome.history.search({
	    'text': "",
	    'startTime': oneWeekAgo,
	    'maxResults': 100000
	  }, function (historyItems) {
	
	    historyItems.forEach(function (historyItem) {
	      var histUrl = historyItem.url.toLowerCase();
	
	      if (histUrl.indexOf("google") === -1) {
	        urls[histUrl] = historyItem;
	
	        chrome.history.getVisits({ url: historyItem.url }, function (itemInfo) {
	          urls[histUrl].info = itemInfo;
	        });
	      }
	    });
	
	    $.ajax({
	      type: "POST",
	      url: "http://127.0.0.1:3000/data",
	      dataType: 'json',
	      data: {
	        urls: JSON.stringify(urls)
	      },
	      success: function success(data) {
	        console.log(data);
	      }
	    });
	  });
	
	  console.log(urls);
	});

/***/ }
/******/ ]);
//# sourceMappingURL=options-bundle.js.map