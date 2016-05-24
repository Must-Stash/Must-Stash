'use strict';

document.getElementById('server').innerHTML = localStorage.getItem("muststashserver") || "www.gny-consulting.com";

var newServer = document.getElementById('server-change');

document.getElementById('submit').addEventListener("click", function(){
  localStorage.setItem("muststashserver", newServer.value);

  document.getElementById('server').innerHTML = localStorage.getItem("muststashserver");
});