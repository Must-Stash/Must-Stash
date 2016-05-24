'use strict';

const $ = require('jquery');
const url = require('url');

chrome.runtime.onStartup.addListener(function() {
  chrome.storage.local.remove('queries');
});

const postStorageInterval = setInterval(postStorage, 20000);

function postStorage() {
  chrome.storage.local.get('activities', function(items) {
    if(items.activities.length > 0) {
      chrome.storage.local.set({ activities: [] }, function() {
        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:3000/api/qa",
          dataType: 'json',
          data: {
            data: items.activities
          },
          success: function(response) {
            console.log("successfully posted local storage");
          }
        });
        console.log('cleared local storage');
      });
    }
  });
}

chrome.webNavigation.onCommitted.addListener(function(webNavData) {
  chrome.storage.local.get(['queries', 'activities'], function(items) {
    let activities = [];

    if(items.activities) {
      activities = items.activities;
    }

    if(webNavData.transitionType === 'link' && !/.*\/\/www.google.com\/search\?.*/.test(webNavData.url)) {
      let activity = {};
      activity.activity = webNavData;
      activity.query = items.queries ? items.queries[webNavData.tabId] : null;

      activities.push(activity);
      chrome.storage.local.set({ activities }, function() {
        console.log('saved activity %s to local storage', webNavData.url);
      });
    }
  });
});


chrome.webRequest.onCompleted.addListener(function(webReqData){
  chrome.storage.local.get('queries', function(items) {
    let queries = {};

    if(items.queries) {
      queries = items.queries;
    }

    webReqData.query_string = url.parse(webReqData.url, true).query.q;
    queries[webReqData.tabId] = webReqData;

    chrome.storage.local.set({ queries : queries }, function() {
      console.log('saved query %s to local storage', webReqData.query_string);
    });
  });
}, {urls: ["*://www.google.com/search*", "*://www.google.com/complete/search*"], types: ['xmlhttprequest']});