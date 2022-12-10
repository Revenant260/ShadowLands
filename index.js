const express = require('express');
const { argv } = require('process');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const back = require('./Server/backend')
app.use(express.static(__dirname + '/public'));
app.get("/", function (req, res) {
  res.redirect("http://localhost:3000/home/")
})

io.on('connection', (socket) => {
  if (new Date - socket.time < 1600) return
  socket.time = new Date
  socket.emit("sends", "user")
  socket.on("new", msg => {
    var entry = back.handle(socket.handshake.address,"join", undefined, socket)
    socket.join(entry["room"])
    io.to(entry["room"]).emit("msg", entry["str"])
  })
  socket.on("reload", msg => {
    console.log(msg)
    var rentry = back.handle(socket.handshake.address, "re", msg, socket)
    socket.join(rentry["room"])
    io.to(rentry["room"]).emit("msg", rentry["str"])
  })

  socket.on('msgs', msg => {
    if (new Date - socket.time < 1600) return
    socket.time = new Date
    var user = back.handle(socket.handshake.address, "msg", msg, socket)
    io.to(user["room"]).emit("msg", user["usern"] + ": " + user["str"])
  });

});

http.listen(3000, () => {
  console.log(`Socket.IO server running`);
});

/*pm2 start index.js -i 4 --watch --max-memory-restart 70M*/
