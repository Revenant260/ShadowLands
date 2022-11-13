const { Socket } = require('socket.io');
var cells = []
var user = {
    usern: "",
    room: "",

}

exports.handle = function(socket = Socket, io) {
    cells[socket.handshake.address] = user
    console.log(cells)
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
}

exports.uhndl = function(req, res, port) {
    return res.redirect(`http://shadow.lands.com:${port}/home`)
}


