var socket = io();

      var messages = document.getElementById('messages');
      var form = document.getElementById('form');
      var input = document.getElementById('input');

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
          socket.emit('chat message', input.value + '|' + localStorage.getItem('userp'));
          if (input.value.startsWith("@")) cmds(input.value.replace("@", "").split(" ")[0], input.value.replace("@", "").split(" ")[1])
          input.value = '';
        }
      });

      function cmds(cmd, vars) {
          let userss = JSON.parse(localStorage.getItem('userp'))
          console.log(cmd, vars)
          switch (cmd) {
            case 'room':
              userss.room = vars
            break
            case 'uname':
              userss.usern = vars
            break
            default: 
            input.value = ''
          }
          socket.emit('userData', JSON.stringify(userss))
        }

      socket.on('connect', () => {
        //const urlParams = new URLSearchParams(window.location.search);
        //const room = urlParams.get('room');
          socket.emit('userData', localStorage.getItem('userp'));
      });

      socket.on('update', (datas) => {
        localStorage.setItem('userp', datas)
      })

      socket.on('chat message', function(msg) {
        var item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });
