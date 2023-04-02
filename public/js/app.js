var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var thip = input.value + '|' + localStorage.getItem('userp')
  if (input.value) {
    socket.emit('chat message', thip);
    input.value = '';
  }
});


socket.on('connect', () => {
  let userss = JSON.parse(localStorage.getItem('userp'))
  if (userss === null) {
  socket.emit('userData', "new")
  } else {
    socket.emit('userData', userss)
    socket.emit('join', userss.room)
  }
});

socket.on('update', (datas) => {
  localStorage.setItem('userp', datas)
  socket.emit('join', JSON.parse(datas).room)
})

socket.on('chat message', function (msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  var local = JSON.parse(localStorage.getItem('userp')).usern + "|" + JSON.parse(localStorage.getItem('userp')).room + "|" + JSON.parse(localStorage.getItem('userp')).id
  if (item.textContent.includes("@active")) socket.emit("active", local)
  window.scrollTo(0, document.body.scrollHeight);
});
