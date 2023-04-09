const setup = require('../configs/settings.json')
const MAX_MESSAGE_LENGTH = setup.settings.msgl;
const MAX_MESSAGES_PER_SECOND = setup.settings.msgpersec;
const SPAM_TIME_INTERVAL = setup.settings.spamtime;
const SPAM_MESSAGE_COUNT = setup.settings.spamcount;
const FILTERED_WORDS = setup.settings.filter;



const messagesByRoom = {};
module.exports.addMessageToRoom = function (roomName, message) {
    if (!messagesByRoom[roomName]) {
        messagesByRoom[roomName] = [];
    }
    messagesByRoom[roomName].push(message);
}

module.exports.getMessagesForRoom = function (roomName) {
    if (!messagesByRoom[roomName]) {
        return [];
    }
    return messagesByRoom[roomName];
}
const users = {};
module.exports.userp = function (ip, usern, room, ban, id) {
    let thip = { "usern": usern.split("|")[0] + `|` + id, "room": room, "ban": ban}
    if (!users[ip]) {
        users[ip] = []
    }
    users[ip] = []
    users[ip].push(JSON.stringify(thip))
    return JSON.stringify(thip)
}
module.exports.getuser = function (ip) {
    if (!users[ip]) {
        return [];
    }
    console.log(JSON.parse(users[ip][0]))
    return JSON.parse(users[ip][0])
}

let messageQueue = []
let lastMessageTime = Date.now()
module.exports.spams = function (msg) {
    if (msg.length > MAX_MESSAGE_LENGTH) {
        return setup.text.bad1
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - lastMessageTime;
    if (timeDiff < 1000 / MAX_MESSAGES_PER_SECOND) {
        return setup.text.bad2
    }

    messageQueue.push(currentTime);
    messageQueue = messageQueue.filter((time) => currentTime - time < SPAM_TIME_INTERVAL * 1000);
    if (messageQueue.length >= SPAM_MESSAGE_COUNT) {
        return setup.text.bad3
    }

    for (const word of FILTERED_WORDS) {
        if (msg.includes(word)) {
            return setup.text.bad4
        }
    }
    lastMessageTime = currentTime;
    return "good"
}
