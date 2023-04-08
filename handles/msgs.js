const setup = require('../handles/configs/settings.json');
var trackrec = require('../handles/configs/vars')

module.exports = function (io) {
  io.on(setup.text.io, (socket) => {
    console.log(socket.request.connection.remoteAddress)


    socket.on("typingMessage", (usert, room) => {
      var id = socket.request.connection.remoteAddress
      var clear = trackrec.getuser(id)
      if (clear.ban > 20) {
        trackrec.userp(id, clear.usern, clear.room, clear.ban)
        return io.to(socket.id).emit(setup.text.chatp, socket.emit(setup.text.chatp, `${setup.text.modbot}${clear.usern} - You are banished, good luck`))
      }
      io.to(room).emit("typing", usert)
    }) 
    socket.on("noLongerTypingMessage", (usert, room) => {
      io.to(room).emit("ntyping", usert)
    })

    socket.on("cmd", (cmd) => {
      var cmds = cmd.replace("@", "").split(" ")[0]
      var use = cmd.replace("@", "").replace(cmds, "").trim()
      var id = socket.request.connection.remoteAddress
      var gate = trackrec.spams(use)
      var thip = trackrec.getuser(id)
      switch (cmds) {
        case "usern":
          thip.usern = use
          trackrec.userp(id, use, thip.room, thip.ban)
          break;
        case "room":
          thip.room = use
          socket.leaveAll();
          socket.join(use)
          socket.emit("joined", trackrec.getMessagesForRoom(use))
          trackrec.userp(id, thip.usern, use, thip.ban)
          var msgs = `${setup.text.modbot}${use} - ${setup.text.welcome}`
          io.to(use).emit(setup.text.chatp, msgs)
          break;
        default:
      }
    })


    socket.on(setup.text.udata, (datas) => {
      var id = socket.request.connection.remoteAddress
      var clear = trackrec.getuser(id)
      if (clear.ban > 20) {
        socket.emit("update", trackrec.userp(id, clear.usern, clear.room, clear.ban))
        return
      }
      var thip = trackrec.userp(id, datas, setup.text.demo, 0)
      socket.leaveAll();
      socket.join(setup.text.demo)
      io.to(socket.id).emit("joined", trackrec.getMessagesForRoom(JSON.parse(thip).room))
      socket.emit("update", thip)
    })

    socket.on(setup.text.chatp, (msg) => {
      var id = socket.request.connection.remoteAddress
      if (msg === "") return
      var clear = trackrec.getuser(id)
      if (clear.ban > 20) {
        trackrec.userp(id, clear.usern, clear.room, clear.ban)
        return io.to(socket.id).emit(setup.text.chatp, socket.emit(setup.text.chatp, `${setup.text.modbot}${clear.usern} - You are banished, good luck`))
      }
      var gate = trackrec.spams(msg)
      if (gate === "good") {
        var msgs = `[${clear.usern}@${clear.room}] - ${msg} - [${new Date().toLocaleTimeString()}]`
        socket.to(clear.room).emit(setup.text.chatp, msgs);
        trackrec.addMessageToRoom(clear.room, msgs)
      } else {
        var thip = trackrec.getuser(id)
        var ban = thip.ban + 1
        trackrec.userp(id, thip.usern, thip.room, ban)
        io.to(thip.room).emit(setup.text.chatp, `${setup.text.modbot}${clear.usern} - ${gate}`);
      }
    });
  })
};
