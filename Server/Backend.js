const { Socket } = require('socket.io');

exports.handle = function(socket = Socket, io) {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
}

exports.uhndl = function(req, res) {
    res.redirect(`http://localhost:${port}/home${var1}`)
}