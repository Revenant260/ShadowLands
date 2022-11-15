var cells = []
var user = {}

function update(msg, user, var1) {
    if (var1) {
        var acc = String(var1).replace("#", "")
        var str = String(msg).replace(var1, "")
        var oldstr = cells[user][acc]
        cells[user][acc] = str
        var block = {
            old: oldstr,
            new: str,
            hand: user,
            str: oldstr + " ---> " + cells[user][acc]
        }
        return block
    }
}

function bricks(sock, strr, socket) {
    var msgss = new String(strr)
    var brick = {
        usern: cells[sock]["usern"],
        room: cells[sock]["room"],
        str: msgss
    }
    return brick
}

exports.handle = (socks, arg, msg, socket) => {

if (arg === "join") {
    if (cells[socks]) return bricks(socks, "AutoBot: Welcome back " + cells[socks]['usern'])
    var userr = {
        usern: "GUEST" + Math.floor(Math.random() * 10000),
        room: "ShadowLands",
        bans: {},
    }
    cells[socks] = userr
    var tmp = "user|" + JSON.stringify(userr)
    socket.emit("store", tmp)
    return bricks(socks, "AutoBot: Welcome " + userr["usern"])
}
if (arg === "msg") {
    if (String(msg).startsWith("#")){
        if (String(msg).startsWith("#usern")) {
            var rtn = update(msg, socks, "#usern")
        }
        if (String(msg).startsWith("#room")) {
            var rtn = update(msg, socks, "#room")
            socket.leave(rtn["old"])
            socket.join(rtn["new"])
        }
        var tmp = "user|" + JSON.stringify(cells[socks])
        socket.emit("store", tmp)
        return bricks(socks, rtn["str"])
    } else {
        return bricks(socks, msg)
    }
}
if (arg === "re") {
    var tmps = JSON.parse(msg)
    cells[socks] = tmps
    return bricks(socks, "AutoBot: Welcome back " + cells[socks]['usern'])
}

}
