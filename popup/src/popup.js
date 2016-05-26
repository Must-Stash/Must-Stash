const $ = require('jquery');

let searchBtn = document.querySelector('#search');
let queryInput = document.querySelector('#query');
let results = document.querySelector('#results');

results.addEventListener("click", function(event){
  chrome.tabs.create({url: event.target.href});
});

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
      queryInput.value = decodeURIComponent(query);

      $.ajax({
        type: "GET",
        url: "http://" + server + "/api/search?q=" + encodeURIComponent(query),
        success: function(data) {
          console.log("successfully received data", data.success[0]);
          results.innerHTML = data.success[0].url;
          results.href = data.success[0].url;
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
      console.log("successfully received data", data);
      results.innerHTML = data.success[0].url;
      results.href = data.success[0].url;
    },
    failure: function(err) {
      results.innerHTML = "";
      results.href = "#";
    }
  });

});



