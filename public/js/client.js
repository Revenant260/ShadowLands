var socket = io();
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var msgs = new Array()

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('msgs', input.value);
    input.value = '';
  }
});

socket.on('msg', function(msg) {
  var item = document.createElement('li');
  msgs.push(msg)
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  localStorage.setItem("msgs", msgs)
});

socket.on("store", function(msg) {
  var keys = msg.split("|")[0]
  var msgs = msg.split("|")[1]
  localStorage.setItem(keys, msgs)
})

socket.on("sends", function(msg) {
  var user = localStorage.getItem(msg)
  if (!user) {
    socket.emit("new", user)
  } else {
    socket.emit("reload", user)
    localStorage.setItem("msgs", msgs)
  }
})

function clearlist(){ 
  var elem = document.getElementById("messages");
  elem.parentNode.removeChild(elem);
} 