const setup = require('../handles/configs/settings.json');
var trackrec = require('../handles/configs/vars')
let ausers = trackrec.users

module.exports = function (io) {
  io.on(setup.text.io, (socket) => {

    socket.on("active", (rooms) => {
      var thip = trackrec.spams(setup.text.demo)
      var bamp = rooms.split("|")
      if (thip !== setup.text.pass) return socket.emit(setup.text.chatp, `[${setup.text.modbot}${bamp[1]}]-[${thip}]`)
      socket.emit.emit(setup.text.chatp, `[${bamp[0]} is active]`)
    })


    socket.on("join", (room) => {
      socket.leaveAll();
      socket.join(room)
    })

    socket.on(setup.text.udata, (datas) => {
      if (datas === "new") {
        let thip = trackrec.userp(socket.id, setup.text.demo, socket.id)
        socket.emit(setup.text.updt, thip)
        socket.join(setup.text.demo)
        io.to(setup.text.demo).emit(setup.text.chatp, `[${setup.text.modbot}${socket.id}]-[${setup.text.welcome}]`);
      }
    })

    socket.on(setup.text.chatp, (msg) => {
      var thip = trackrec.spams(msg.split("|")[0])
      var thip2 = JSON.parse(msg.split("|")[1])
      var thi2 = trackrec.userp(thip2.usern, thip2.room, socket.id)
      if (thip === "good") {
        if (msg.split("|")[0].startsWith("@")) {
          var cmd = msg.split("|")[0].replace("@", "").split(" ")[0]
          var rte = trackrec.cmds(cmd, msg.split("|")[0].split(" ")[1], thip2)
          var rte2 = JSON.stringify(rte)
          socket.emit(setup.text.updt, rte2)
        }
        socket.to(thip2.room).emit(setup.text.chatp, `[${thip2.usern}@${thip2.room}]-[${msg.split("|")[0]}]`);
      } else {
        socket.emit(setup.text.chatp, `[${setup.text.modbot}${thip2.usern}]-[${thip}]`);
      }
    });
  })
};
