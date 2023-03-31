var socket = io();

      var messages = document.getElementById('messages');
      var form = document.getElementById('form');
      var input = document.getElementById('input');

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
          socket.emit('chat message', input.value + "|" + localStorage.getItem('username'));
          input.value = '';
        }
      });

      socket.on('connect', () => {
          socket.emit('userData', localStorage.getItem('username'));
      });

      socket.on('update', (datas) => {
        localStorage.setItem('username', socket.id)
      })

      socket.on('chat message', function(msg) {
        var item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });
