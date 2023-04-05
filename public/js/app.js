var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!input.value.startsWith("@")) {
    socket.emit('chat message', input.value);
  } else {
    socket.emit("cmd", input.value)
  }
  input.value = '';
});

socket.on('connect', () => {
  var url = new URL(window.location.href);
  var rooms = url.href.replace("/#", "/").split("=")[1]
  var thip = localStorage.getItem("userp")
  if (!thip) {
    let person = prompt("Please enter your name", "Harry Potter");
    return socket.emit("userData", person)
  }
  socket.emit("userData", JSON.parse(thip).usern);
  if (rooms !== JSON.parse(thip).room) socket.emit("cmd", `@room ${rooms}`)
})

socket.on('update', (datas) => {
  localStorage.clear()
  localStorage.setItem("userp", datas)
  socket.emit("rtnuse", JSON.parse(localStorage.getItem("userp")).room)
})

socket.on('chat message', function (msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  messages.lastChild.scrollIntoView({ behavior: "smooth" })
});

socket.on('joined', (msgs) => {
  messages.innerHTML = ''
  msgs.forEach((a) => {
    var item = document.createElement('li');
    item.textContent = a;
    messages.appendChild(item);
  })
})

window.addEventListener('popstate', function (event) {
  var url = new URL(window.location.href);
  socket.emit("cmd", `@room ${url.href.replace("/#", "/").split("=")[1]}`)
});