const MAX_MESSAGE_LENGTH = 200;
const MAX_MESSAGES_PER_SECOND = 10;
const SPAM_TIME_INTERVAL = 10; 
const SPAM_MESSAGE_COUNT = 10; 
const FILTERED_WORDS = ['nigger', 'Nigger']; 

let messageQueue = [];
let lastMessageTime = Date.now();
let ausers = []

module.exports = function(io) {
    io.on('connection', (socket) => {

    socket.on('userData', (datas) => {
      console.log(datas)
      
      let userp = JSON.stringify({
        usern: socket.id,
        room: "shadowlands",
      })

      socket.leaveAll();
      if (datas) {
        socket.join(JSON.parse(datas).room)
          socket.emit('chat message', `[admin@${JSON.parse(datas).room}]:[Welcome back ${JSON.parse(datas).usern}]`)
          socket.emit('update', datas)
      } else {
      socket.join(JSON.parse(userp).room)
          io.to(JSON.parse(userp).room).emit('chat message', `[admin@${JSON.parse(userp).room}]:[Welcome ${JSON.parse(userp).usern}]`)
          socket.emit('update', userp)
      }

    })

    socket.on('chat message', (msg) => {
        var thip = spams(msg)
        if (thip === "good") {
          io.to(JSON.parse(msg.split("|")[1]).room).emit('chat message', `[${JSON.parse(msg.split("|")[1]).usern}@${JSON.parse(msg.split("|")[1]).room}]:[${msg.split("|")[0]}]`);
        } else {
          io.to(JSON.parse(msg.split("|")[1]).room).emit('chat message', `[admin@${JSON.parse(msg.split("|")[1]).room}]:[${thip}]`);
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