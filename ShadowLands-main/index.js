const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;
const socks = require('./handles/msgs');
const setup = require('./handles/configs/settings.json').files;

app.use(express.static('public'));
app.set('trust proxy', true)

app.get(setup.entry, (req, res) => {
  const filePath = path.join(__dirname, 'public', setup.support4);
  res.sendFile(filePath);
});
app.get(setup.support, (req, res) => {
  const filePath = path.join(__dirname, 'public', setup.support1);
  res.sendFile(filePath);
});
app.get(setup.support2, (req, res) => {
  const filePath = path.join(__dirname, 'public', setup.support3);
  res.sendFile(filePath);
});

socks(io);

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
