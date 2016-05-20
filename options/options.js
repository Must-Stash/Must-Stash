'use strict';

var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 90;
var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

document.getElementById('sendhistory').addEventListener("click", function(){

  chrome.history.search({
    'text' : "",
    'startTime' : oneWeekAgo,
    'maxResults' : 1000000
  }, function(historyItems){

    var chunkLength = 100;
    var count = 0;

    var payloadArray = historyItems.filter(function(historyItem) {
      if(historyItem.url.indexOf('google') !== -1 && historyItem.url.indexOf('q=') !== -1) {
       return false;
      }
      return true;
    }).map(function(element){
      return {
        activity : element
      };
    }).reduce(function(prev, curr) {
      if(prev[count].length === chunkLength) {
        prev.push([]);
        count++;
      }
      prev[count].push(curr);
      return prev;
    }, [[]]);

    sendRequest(payloadArray, payloadArray.length -1);

  });
});

function sendRequest(payloadArray, index) {

  if(index < 0) {
    return;
  }

  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:3000/api/qa",
    dataType: 'json',
    data: {
      data : payloadArray[index]
    },
    success: function(data) {
      sendRequest(payloadArray, index - 1);
    }
  });
}