const express = require('express');
const path = require('path');
const { stringify } = require('querystring');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 1260;

const back = require('./server/backend')

app.use(express.static(__dirname + '/public'));



app.get("/", function (req, res) {
  res.sendFile(__dirname + '/public/home/index.html')
})

io.on('connection', (socket) => {
  var user =  back.handle(socket, "join", undefined)
  var str = new String(back.handle(socket, "welcome", undefined))
  io.to(user["room"]).emit('chat message', str)
  socket.emit("strg", socket.handshake.address, user)

  socket.on('chat message', msg => {
    var str1 = back.handle(socket, "msg", msg)
    io.emit("strg", str1["user"] , str1["str"])
    io.to(str1["room"]).emit('chat message', str1["str"])
  });

  socket.on("disconnect", (reason) => {
    var str2 = back.handle(socket, "user", undefined)
    var str3 = back.handle(socket, "leave", undefined)
    socket.leave(str3["room"])
    io.to(str2["room"]).emit('chat message', str3["str"])
  })

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

/*ds>pm2 start server.js -i 0 --watch*/