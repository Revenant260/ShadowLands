const { Socket } = require('socket.io');
var cells = []
var user = {
    usern: "",
    room: "",

}

exports.handle = function(socket = Socket, io) {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
}

exports.uhndl = function(req, res, port) {
    cells[req.ip] = user
    console.log(cells)
    res.redirect(`http://127.0.0.1:${port}/home`)
}


