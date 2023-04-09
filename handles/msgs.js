const setup = require('../handles/configs/settings.json');
var trackrec = require('../handles/configs/vars')

module.exports = function (io) {
  io.on(setup.text.io, (socket) => {
    console.log(socket.request.connection.remoteAddress)

    socket.on('msgld', (user, room) => {

    })

    socket.on("typingMessage", (usert, room) => {
      var id = socket.request.connection.remoteAddress
      var nme = usert.split("|")[0]
      var clear = trackrec.getuser(id)
      if (clear.ban > 20) return
      io.to(room).emit("typing", nme)
    }) 
    socket.on("noLongerTypingMessage", (usert, room) => {
      var nme = usert.replace("|" + socket.id, "")
      io.to(room).emit("ntyping", nme)
    })

    socket.on("cmd", (cmd) => {
      var cmds = cmd.replace("@", "").split(" ")[0]
      var use = cmd.replace("@", "").replace(cmds, "").trim()
      var id = socket.request.connection.remoteAddress
      var gate = trackrec.spams(use)
      var thip = trackrec.getuser(id)
      var nme = thip.usern.replace("|" + socket.id, "")
      switch (cmds) {
        case "usern":
          thip.usern = use + "|" + socket.id
          trackrec.userp(id, use, thip.room, thip.ban, socket.id)
          socket.emit(setup.text.updt, JSON.stringify(thip))
          break;
        case "room":
          thip.room = use
          thip.usern = thip.usern + "|" + socket.id
          socket.leaveAll();
          socket.join(use)
          socket.emit("joined", trackrec.getMessagesForRoom(use))
          trackrec.userp(id, thip.usern, use, thip.ban, socket.id)
          var msgs = `[${setup.text.modbot}@${use}] - ${setup.text.welcome}`
          io.to(use).emit(setup.text.chatp, msgs)
          socket.emit(setup.text.updt, JSON.stringify(thip))
          break;
        default:
      }
    })


    socket.on(setup.text.udata, (datas) => {
      var id = socket.request.connection.remoteAddress
      var clear = trackrec.getuser(id)
      if (clear.ban > 20) {
        socket.emit("update", trackrec.userp(id, clear.usern, clear.room, clear.ban, socket.id))
        return
      }
      var thip = trackrec.userp(id, datas, setup.text.demo, 0, socket.id)
      socket.leaveAll();
      socket.join(setup.text.demo)
      io.to(socket.id).emit("joined", trackrec.getMessagesForRoom(JSON.parse(thip).room))
      socket.emit("update", thip)
    })

    socket.on(setup.text.chatp, (msg) => {
      var id = socket.request.connection.remoteAddress
      if (msg === "") return
      var clear = trackrec.getuser(id)
      var nme = clear.usern.replace("|" + socket.id, "")
      if (clear.ban > 20) {
        trackrec.userp(id, clear.usern, clear.room, clear.ban, socket.id)
        return io.to(socket.id).emit(setup.text.chatp, socket.emit(setup.text.chatp, `${setup.text.modbot}${nme} - You are banished, good luck`))
      }
      var gate = trackrec.spams(msg)
      if (gate === "good") {
        var msgs = `[${nme}@${clear.room}] - ${msg} - [${new Date().toLocaleTimeString()}]`
        socket.to(clear.room).emit(setup.text.chatp, msgs);
        trackrec.addMessageToRoom(clear.room, msgs)
      } else {
        var thip = trackrec.getuser(id)
        var ban = thip.ban + 1
        trackrec.userp(id, thip.usern, thip.room, ban, socket.id)
        io.to(thip.room).emit(setup.text.chatp, `[${setup.text.modbot}@${clear.usern}] - ${gate}`);
      }
    });
  })
};
