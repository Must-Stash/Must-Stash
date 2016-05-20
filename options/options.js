'use strict';

var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 30;
var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

document.getElementById('sendhistory').addEventListener("click", function(){

  chrome.history.search({
    'text' : "",
    'startTime' : oneWeekAgo,
    'maxResults' : 100000
  }, function(historyItems){

    var payload = historyItems.map(function(element){
      return {
        activity : element
      };
    });

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:3000/api/qa",
      dataType: 'json',
      data: {
        data : payload
      },
      success: function(data) {
        console.log(data);
      }
    });

  });



});