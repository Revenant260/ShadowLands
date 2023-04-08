var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var type = document.getElementById("typing")

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
  var thip = localStorage.getItem("userp")
  if (!thip) {
    let person = prompt("Please enter your name", "Harry Potter");
    return socket.emit("userData", person)
  }
  socket.emit("userData", JSON.parse(thip).usern);
  if (rooms !== JSON.parse(thip).room) {
  }

  var searchParams = new URLSearchParams(window.location.search);
  var rooms = searchParams.get('room');
  socket.emit("cmd", `@room ${rooms}`)
})

socket.on('update', (datas) => {
  localStorage.clear()
  localStorage.setItem("userp", datas)
})

socket.on('chat message', function (msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  messages.lastChild.scrollIntoView({ behavior: "smooth" })
  type.innerHTML = ""
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
  var searchParams = new URLSearchParams(window.location.search);
  var rooms = searchParams.get('room');
  socket.emit("cmd", `@room ${rooms}`)
});
;
socket.on("typing", users => {
  var types = document.createElement('li')
  types.textContent = users + " is typing"
  types.id = users
  if (document.getElementById(users) !== "") return
  type.appendChild(types);
})
socket.on("ntyping", users => {
  document.getElementById(users).innerHTML = "";
  type.innerHTML.at(type.innerHTML.length()) = ""
  type.innerHTML = ""
})

var typing = false;
var timeout = undefined;

function timeoutFunction() {
  typing = false;
  var tmp = JSON.parse(localStorage.getItem("userp")).usern
  socket.emit("noLongerTypingMessage", tmp, JSON.parse(localStorage.getItem("userp")).room);
}

function typ() {
  if (typing == false) {
    typing = true
    var tmp = JSON.parse(localStorage.getItem("userp")).usern
    socket.emit("typingMessage", tmp, JSON.parse(localStorage.getItem("userp")).room);
    timeout = setTimeout(timeoutFunction, 5000)
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 2000)
  }

}