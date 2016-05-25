const $ = require('jquery');

let searchBtn = document.querySelector('#search');
let queryInput = document.querySelector('#query');
let results = document.querySelector('#results');

const server = localStorage.getItem("muststashserver") || "www.gny-consulting.com";

chrome.tabs.query({
  active: true,
  currentWindow: true
},
function(tabs) {
  let currTab = tabs[0];
  chrome.storage.local.get('queries', function(items) {
    var query = items.queries[currTab.id].query_string;
    if(query) {
      queryInput.value = query;

      $.ajax({
        type: "GET",
        url: "http://" + server + "/api/search?q=" + encodeURIComponent(query),
        success: function(data) {
          console.log("successfully received data", data.success);
          results.innerHTML = data.success[0]._source.url;
          results.href = data.success[0]._source.url;
        }
      });
    }
  });
});

searchBtn.addEventListener('click', function(evt) {
  let query = queryInput.value;

  $.ajax({
    type: "GET",
    url: "http://" + server + "/api/search?q=" + encodeURIComponent(query),
    success: function(data) {
      console.log("successfully received data");
      results.innerHTML = data.success[0]._source.url;
      results.href = data.success[0]._source.url;
    },
    failure: function(err) {
      results.innerHTML = "";
      results.href = "#";
    }
  });

});


