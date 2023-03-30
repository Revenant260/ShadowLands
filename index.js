const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;


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

const MAX_MESSAGE_LENGTH = 200; // maximum allowed length of a message
const MAX_MESSAGES_PER_SECOND = 5; // maximum number of messages allowed per second
const SPAM_TIME_INTERVAL = 10; // time interval (in seconds) used to check for spam messages
const SPAM_MESSAGE_COUNT = 3; // maximum number of messages allowed within the spam time interval
const FILTERED_WORDS = ['bad', 'offensive', 'inappropriate']; // words to filter out of messages

let messageQueue = []; // stores messages for the spam filter
let lastMessageTime = Date.now(); // tracks the time of the last message for the message rate limiter

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    // Apply message filters
    if (msg.length > MAX_MESSAGE_LENGTH) {
      // Reject messages that are too long
      socket.emit('chat error', 'Message is too long');
      return;
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - lastMessageTime;
    if (timeDiff < 1000 / MAX_MESSAGES_PER_SECOND) {
      // Reject messages that are sent too frequently
      socket.emit('chat error', 'You are sending messages too quickly');
      return;
    }

    messageQueue.push(currentTime);
    messageQueue = messageQueue.filter((time) => currentTime - time < SPAM_TIME_INTERVAL * 1000);
    if (messageQueue.length >= SPAM_MESSAGE_COUNT) {
      // Reject messages that are spamming too frequently
      socket.emit('chat error', 'You are sending too many messages');
      return;
    }

    for (const word of FILTERED_WORDS) {
      if (msg.includes(word)) {
        // Reject messages that contain filtered words
        socket.emit('chat error', 'Your message contains inappropriate content');
        return;
      }
    }

    // Send the message to all clients
    io.emit('chat message', `[${socket.id}@${socket.request.connection.remoteAddress}]:[${msg}]`);
    lastMessageTime = currentTime;
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
