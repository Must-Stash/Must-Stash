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
	
	var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 90;
	var oneWeekAgo = new Date().getTime() - microsecondsPerWeek;
	
	document.getElementById('sendhistory').addEventListener("click", function () {
	
	  chrome.history.search({
	    'text': "",
	    'startTime': oneWeekAgo,
	    'maxResults': 1000000
	  }, function (historyItems) {
	
	    var chunkLength = 100;
	    var count = 0;
	
	    var payloadArray = historyItems.filter(function (historyItem) {
	      if (historyItem.url.indexOf('google') !== -1 && historyItem.url.indexOf('q=') !== -1) {
	        return false;
	      }
	      return true;
	    }).map(function (element) {
	      return {
	        activity: element
	      };
	    }).reduce(function (prev, curr) {
	      if (prev[count].length === chunkLength) {
	        prev.push([]);
	        count++;
	      }
	      prev[count].push(curr);
	      return prev;
	    }, [[]]);
	
	    sendRequest(payloadArray, payloadArray.length - 1);
	  });
	});
	
	function sendRequest(payloadArray, index) {
	
	  if (index < 0) {
	    return;
	  }
	
	  $.ajax({
	    type: "POST",
	    url: "http://127.0.0.1:3000/api/qa",
	    dataType: 'json',
	    data: {
	      data: payloadArray[index]
	    },
	    success: function success(data) {
	      sendRequest(payloadArray, index - 1);
	    }
	  });
	}

/***/ }
/******/ ]);
//# sourceMappingURL=options-bundle.js.map