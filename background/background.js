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
  if(data.url === "https://www.reddit.com/"){
    chrome.storage.local.clear(function(){
      console.log("storage cleared");

      chrome.storage.local.get(["data"], function(result){
        console.log("cleared?", result);
      })

    })
  }

  if(data.url === "https://www.codecademy.com/"){
    chrome.storage.local.get(["data"], function(result){
      try{
        console.log("checkdata", JSON.parse(result.data));
      }
      catch(err){
        console.log("data object is empty");
      }
    })
  }

  if(data.url === "https://www.freecodecamp.com/"){
    clearInterval(sendInterval);
    console.log("interval cleared");
  }

  if(data.transitionType === "link"){
    data.interaction = "activity";

    chrome.storage.local.get(["data"], function(items){
      if(Object.keys(items).length === 0){
        chrome.storage.local.set({['data']: JSON.stringify([data])}, function(){
          console.log("saved data to storage");
        });
      }
      else {
        var dataArray = JSON.parse(items.data);
        dataArray.push(data);

        chrome.storage.local.set({['data']: JSON.stringify(dataArray)}, function(){
          console.log("saved data to storage");
        });
      }
    })


  }


});

chrome.webRequest.onCompleted.addListener(function(data){

  console.log(data);

  data.interaction = "query";
  chrome.storage.local.get(["data"], function(items){
    if(Object.keys(items).length === 0){
      chrome.storage.local.set({['data']: JSON.stringify([data])}, function(){
        console.log("saved data to storage");
      });
    }
    else {
      var dataArray = JSON.parse(items.data);

      if(dataArray[dataArray.length -1].interaction === "query"){
        dataArray.pop();
      }

      dataArray.push(data);

      chrome.storage.local.set({['data']: JSON.stringify(dataArray)}, function(){
        console.log("saved data to storage");
      });
    }
  })

}, {urls: ["*://www.google.com/search*", "*://www.google.com/complete/search*"], types: ['xmlhttprequest']});


//periodically sending localstorage to database
function transferLocalStorage(){
  chrome.storage.local.get(["data"], function(data){

    if(Object.keys(data).length === 0){
      console.log("No new queries or activity");
    }
    else {
      console.log(JSON.parse(data.data));

      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/api/queries",
        dataType: 'json',
        data: {
          data: JSON.parse(data.data)
        },
        success: function(response) {
          console.log(response);
          chrome.storage.local.clear(function(){
            console.log("storage cleared");

            chrome.storage.local.get(["data"], function(result){
              console.log("cleared?", result);
            })

          })
        }
      });

    }

  })
}

var sendInterval = setInterval(transferLocalStorage, 10000);