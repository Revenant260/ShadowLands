var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value + '|' + localStorage.getItem('userp'));
    if (input.value.startsWith("@")) cmds(input.value.replace("@", "").split(" ")[0], input.value.replace("@", "").split(" ")[1])
    input.value = '';
  }
});

function cmds(cmd, vars) {
  let userss = JSON.parse(localStorage.getItem('userp'))
  switch (cmd) {
    case 'room':
      userss.room = vars
      socket.emit("userData", JSON.stringify(userss))
      break
    case 'uname':
      userss.usern = vars
      socket.emit("userData", JSON.stringify(userss))
      break
    case 'active':
      socket.emit("active", userss)
      break
    default:
      input.value = ''
  }
}

socket.on('connect', () => {
  history.pushState({}, null, `/`)
  const urlParams = new URLSearchParams(window.location.search);
  const roomu = urlParams.get('room');
  if (roomu !== null) {
    let userss = JSON.parse(localStorage.getItem('userp'))
    userss.room = roomu
    socket.emit('userData', JSON.stringify(userss))
  } else {
    socket.emit('userData', localStorage.getItem('userp'));
  }
});

socket.on('update', (datas) => {
  history.pushState({}, null, `/?room=${JSON.parse(datas).room}`)
  localStorage.setItem('userp', datas)
})

socket.on('chat message', function (msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
