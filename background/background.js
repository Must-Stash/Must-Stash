'use strict';

//sends history to backend on installation
chrome.runtime.onInstalled.addListener(function(data){
  if(data.reason === "install"){
    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 30;
    var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

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

  }
});

//sends activity data.
chrome.webNavigation.onCommitted.addListener(function(data) {
  if(data.url === "https://www.reddit.com/"){
    chrome.storage.local.clear(function(){
      console.log("storage cleared");

      chrome.storage.local.get(["activites","queries"], function(result){
        console.log("cleared?", result);
      });

    });
  }

  if(data.url === "https://www.codecademy.com/"){
    chrome.storage.local.get(["queries", "activities"], function(result){
      try{
        console.log("checkdata queries", JSON.parse(result.queries));
        console.log("checkdata activities", JSON.parse(result.activities));
      }
      catch(err){
        console.log("object is empty");
      }
    });
  }

  if(data.url === "https://www.freecodecamp.com/"){
    clearInterval(sendInterval);
    console.log("interval cleared");
  }

  if(data.transitionType === "link"){
    data.interaction = "activity";

    chrome.storage.local.get(["activities"], function(items){
      if(Object.keys(items).length === 0){
        chrome.storage.local.set({['activities']: JSON.stringify([data])}, function(){
          console.log("saved activity to storage");
        });
      }
      else {
        var dataArray = JSON.parse(items.activities);
        dataArray.push(data);

        chrome.storage.local.set({['activities']: JSON.stringify(dataArray)}, function(){
          console.log("saved activity to storage");
        });
      }
    });
  }

});

chrome.webRequest.onCompleted.addListener(function(data){

  console.log(data);

  data.interaction = "query";
  chrome.storage.local.get(["queries"], function(items){
    if(Object.keys(items).length === 0){
      chrome.storage.local.set({['queries']: JSON.stringify([data])}, function(){
        console.log("saved query to storage");
      });
    }
    else {
      var dataArray = JSON.parse(items.queries);

      dataArray.push(data);

      chrome.storage.local.set({['queries']: JSON.stringify(dataArray)}, function(){
        console.log("saved query to storage");
      });
    }
  });

}, {urls: ["*://www.google.com/search*", "*://www.google.com/complete/search*"], types: ['xmlhttprequest']});


// periodically sending localstorage to database
function transferLocalStorage(callback){
  chrome.storage.local.get(["activities"], function(activities){

    if(Object.keys(activities).length === 0){
      console.log("No new activities");
    }
    else {

      chrome.storage.local.get(["queries"], function(queries){

        var payload = [];

        var allActivities = JSON.parse(activities.activities);
        var allQueries = JSON.parse(queries.queries);

        allActivities.forEach(function(element){
          var packet = {
            activity : element
          };

          for (var i = allQueries.length - 1; i >= 0; i--){
            if(allQueries[i].tabId === element.tabId
            && allQueries[i].timeStamp < element.timeStamp) {
              packet.query = allQueries[i];
              break;
            }
          }

          payload.push(packet);

        });

        if(payload.length > 0){
          $.ajax({
            type: "POST",
            url: "http://127.0.0.1:3000/api/qa",
            dataType: 'json',
            data: {
              data: payload
            },
            success: function(response) {
              console.log("payload sent");
              chrome.storage.local.set({['activities']: JSON.stringify([])}, function(){
                console.log("cleared activity localstorage");
              });
              if(callback){
                callback();
              }
            }
          });
        }
        else {
          console.log("no payload")
        }

      })



    }

  })
}

var sendInterval = setInterval(transferLocalStorage, 20000);

function onStartup() {
  transferLocalStorage(function(){
    chrome.storage.local.set({['queries']: JSON.stringify([])}, function(){
      console.log("cleared queries localstorage");
    });
  });

}

chrome.runtime.onStartup.addListener( onStartup );
