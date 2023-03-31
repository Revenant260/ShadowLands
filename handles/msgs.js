const MAX_MESSAGE_LENGTH = 200;
const MAX_MESSAGES_PER_SECOND = 1;
const SPAM_TIME_INTERVAL = 8; 
const SPAM_MESSAGE_COUNT = 8; 
const FILTERED_WORDS = ['bad', 'offensive', 'inappropriate']; 

let messageQueue = [];
let lastMessageTime = Date.now();
let ausers = []

module.exports = function(io) {
    io.on('connection', (socket) => {
    socket.on('userData', (datas) => {
        if (datas) {
            socket.emit('chat message', `[admin@shadowlands]:[Welcome back ${datas}]`)
        } else {
            io.emit('chat message', `[admin@shadowlands]:[Welcome ${socket.id}]`)
            socket.emit('update', socket.id)
        }
    })
    socket.on('chat message', (msg) => {
        var thip = spams(msg)
        if (thip === "good") {
            io.emit('chat message', `[${msg.split("|")[1]}@shadowlands]:[${msg.split("|")[0]}]`);
        } else {
            io.emit('chat message', `[admin@shadowlands]:[${thip}]`);
        }
      });
    })
};

function spams(msgs) {
    let msg = msgs.split("|")[0]
        if (msg.length > MAX_MESSAGE_LENGTH) {
            return 'Message is too long'
          }
      
          const currentTime = Date.now();
          const timeDiff = currentTime - lastMessageTime;
          if (timeDiff < 1000 / MAX_MESSAGES_PER_SECOND) {
            return 'You are sending messages too quickly'
          }
      
          messageQueue.push(currentTime);
          messageQueue = messageQueue.filter((time) => currentTime - time < SPAM_TIME_INTERVAL * 1000);
          if (messageQueue.length >= SPAM_MESSAGE_COUNT) {
            return 'You are sending too many messages'
          }
      
          for (const word of FILTERED_WORDS) {
            if (msg.includes(word)) {
              return 'Your message contains inappropriate content'
            }
          }
          lastMessageTime = currentTime;
          return "good"
}