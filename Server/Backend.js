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
        bans: {}
    }
    cells[socks] = userr
    var tmp = "user|" + JSON.stringify(userr)
    socket.emit("store", tmp)
    return bricks(socks, "AutoBot: Welcome " + userr["usern"] + " #help to get started.")
}
if (arg === "msg") {
    if (String(msg).startsWith("#")){
        if (msg)
        if (String(msg).startsWith("#help")) {
            return bricks(socks, "ShadowLands: So welcome to shadow lands, this is a place of chaos as of now, constant updates ect [#help - got you here | #usern name | #room room name] with these 2 commands you can create a whole world of chance and choice.")
        }
        if (String(msg).startsWith("#usern")) {
            if (String(msg).length > 50) return bricks(socks, "AutoBot --> " + cells[socks]['usern'] + " your name is too long")
            var rtn = update(msg, socks, "#usern")
        }
        if (String(msg).startsWith("#room")) {
            if (String(msg).length > 25) return bricks(socks, "AutoBot --> " + cells[socks]['usern'] + " too big of a room name")
            var rtn = update(msg, socks, "#room")
            socket.leave(String(rtn["new"]))
            socket.join(String(rtn["new"]).trimStart())
        }
        var tmp = "user|" + JSON.stringify(cells[socks])
        socket.emit("store", tmp)
        return bricks(socks, rtn["str"])
    } else {
        if (String(msg).length > 300) return bricks(socks, "AutoBot --> " + cells[socks]['usern'] + " your msg is too big")
        return bricks(socks, msg)
    }
}
if (arg === "re") {
    var tmps = JSON.parse(msg)
    cells[socks] = tmps
    return bricks(socks, "AutoBot: Welcome back " + cells[socks]['usern'])
}

}
