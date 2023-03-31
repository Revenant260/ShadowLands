const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;
const socks = require('./handles/msgs');


app.use(express.static('public'));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public', '/html/index.html');
  res.sendFile(filePath);
});
app.get('/index.css', (req, res) => {
  const filePath = path.join(__dirname, 'public', '/css/index.css');
  res.sendFile(filePath);
});
app.get('/app.js', (req, res) => {
  const filePath = path.join(__dirname, 'public', '/js/app.js');
  res.sendFile(filePath);
});

socks(io);

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
