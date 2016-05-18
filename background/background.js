'use strict';

//sends history to backend on installation
chrome.runtime.onInstalled.addListener(function(data){
  if(data.reason === "install"){
    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 30;
    var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

    var urls = {};

    chrome.history.search({
      'text' : "",
      'startTime' : oneWeekAgo,
      'maxResults' : 100000
    }, function(historyItems){

      historyItems.forEach(function(historyItem){
        var histUrl = historyItem.url.toLowerCase();

        if(histUrl.indexOf("google") === -1){
          urls[histUrl] = historyItem;

          chrome.history.getVisits({url : historyItem.url}, function(itemInfo){
            urls[histUrl].info = itemInfo;
          });
        }

      });

      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/api/history",
        dataType: 'json',
        data: {
          urls : JSON.stringify(urls)
        },
        success: function(data) {
          console.log(data);
        }
      });

    });
  }
});


//sends activity data.
chrome.webNavigation.onCommitted.addListener(function(data) {

  console.log("activity", data);


});

chrome.webRequest.onCompleted.addListener(function(data){

  console.log("query", data);

}, {urls: ["*://www.google.com/search?*"], types: ['xmlhttprequest']});