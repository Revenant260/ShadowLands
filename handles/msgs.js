const setup = require('../handles/configs/settings.json');
var trackrec = require('../handles/configs/vars')
let ausers = trackrec.users

module.exports = function (io) {
  io.on(setup.text.io, (socket) => {

    socket.on("active", (rooms) => {
      const connectedClients = io.sockets.adapter.rooms.get(`${rooms.room}`)
      const clientsArray = Array.from(connectedClients);
      const clientsString = clientsArray.join('\n').replace(socket.id, rooms.usern)
      socket.emit(setup.text.chatp, `[${setup.text.modbot + rooms.usern}]:[${clientsString}]`)
    })

    socket.on(setup.text.udata, (datas) => {
      let userp = trackrec.userp(socket.id, setup.text.demo)

      socket.leaveAll();
      if (datas) {
        var thip = trackrec.spams(datas)
        if (thip !== setup.text.pass) return socket.emit(setup.text.chatp, `[${setup.text.modbot + JSON.parse(datas).usern}]:[${thip}]`)
        socket.emit(setup.text.updt, datas)
        socket.join(JSON.parse(datas).room)
      } else {
        socket.join(JSON.parse(userp).room)
        io.to(JSON.parse(userp).room).emit(setup.text.chatp, `[${setup.text.modbot + JSON.parse(userp).room}]:[Welcome ${JSON.parse(userp).usern} ${setup.text.welcome}]`)
        socket.emit(setup.text.updt, userp)
      }

    })

    socket.on(setup.text.chatp, (msg) => {
      var thip = trackrec.spams(msg)
      if (thip === "good") {
        io.to(JSON.parse(msg.split("|")[1]).room).emit(setup.text.chatp, `[${JSON.parse(msg.split("|")[1]).usern}@${JSON.parse(msg.split("|")[1]).room}]:[${msg.split("|")[0]}]` + `:[${new Date().toLocaleTimeString()}]`);
      } else {
        socket.emit(setup.text.chatp, `[${setup.text.modbot + JSON.parse(msg.split("|")[1]).usern}]:[${thip}]`);
      }
    });
  })
};
