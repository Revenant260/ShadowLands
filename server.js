const express = require('express');
const path = require('path')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const back = require('./server/backend')

app.use(express.static(__dirname + '/public'));

app.get('/join', function (req, res) {
})

app.get('/', function (req, res) {
  back.uhndl(req, res, port)
})

io.on('connection', (socket) => {
  back.handle(socket, io)
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://127.0.0.1:${port}/`);
});