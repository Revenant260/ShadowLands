var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
//var stores = []

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var thip = input.value + '|' + localStorage.getItem('userp')
  if (input.value) {
    socket.emit('chat message', thip);
    input.value = '';
  }
});

window.onload = function() {
  //var store = sessionStorage.getItem("msgs")
 // console.log(store)
 // var tmp = store.split("@|@")
  //tmp.forEach(ele => {
   // var item = document.createElement('li');
   // item.textContent = ele
   // messages.appendChild(item);
 // });
}

socket.on('connect', () => {
  let userss = JSON.parse(localStorage.getItem('userp'))
  if (userss === null) {
    socket.emit('userData', "new")
    stores.push("Joined Shadowlands")
    stores = sessionStorage.setItem("msgs")
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
  //stores.push(msg)
  //var tmp = stores.join("@|@")
  //sessionStorage.setItem("msgs", tmp)
  messages.appendChild(item);
  messages.lastChild.scrollIntoView({ behavior: "smooth" })
  var local = JSON.parse(localStorage.getItem('userp')).usern + "|" + JSON.parse(localStorage.getItem('userp')).room + "|" + JSON.parse(localStorage.getItem('userp')).id
  if (item.textContent.includes(JSON.parse(localStorage.getItem('userp')).usern)) return
  if (item.textContent.includes("@active")) return socket.emit("active", local)
});

function GFG_Fun(msg, item) {
  var url = msg.replace("!link!", "").split("|")[1]
  var a = document.createElement('a');
  var link = document.createTextNode(url);
  a.appendChild(link);
  a.title = url;
  a.href = url;
  item.textContent = msg.replace(`!link!${url}`, "")
  item.appendChild(a)
  messages.appendChild(item);
}