const { Socket } = require('socket.io');
var cells = []
var user = {}



exports.handle = function(socket = Socket, arg, msg) {
    if (arg === "join") {
        user ={
            usern: "GUEST" + Math.floor(Math.random() * 10000).toString(),
            room: "shadowlands"
        }
        cells[socket.handshake.address] = user
        socket.join(cells[socket.handshake.address]["room"])
        return user
    } else {
        user = cells[socket.handshake.address]
        if (arg === "welcome") {
            var str = new String("Welcome " + user["usern"] + " to " + user["room"])
            return str
        }
        if (arg === "msg") {
            var str = new String(user["usern"] + ": " + msg)
            var brick = {
                room: user["room"],
                user: user["usern"],
                str: str
            }
            return brick
        }
        if (arg === "user") {
            var userr = {
                usern: cells[socket.handshake.address]["usern"],
                room: cells[socket.handshake.address]["room"]
            }
            return userr
        }
        if (arg === "leave") {
            var str = new String(user["usern"] + " has left the building")
            var brick = {
                room: user["room"],
                str: str
            }
            return brick
        }
    }
}

