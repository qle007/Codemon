var express = require("express")
var app = express()
var serv = require('http').Server(app)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html')
})

app.use('/client', express.static(__dirname + '/client'))

serv.listen(1000)
console.log("Server started!")

var SOCKET_LIST = {}
var PLAYER_LIST = {}

var Player = (id)=>{
    var self = {
        health: 200,
        id:id,
        number: "" + Math.floor(10 * Math.random())
    }
    return self
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', (socket)=>{
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    var player = Player(socket.id)
    PLAYER_LIST[socket.id] = player

    socket.on('disconnect',()=>{
        delete SOCKET_LIST[socket.id]
        delete PLAYER_LIST[socket.id]

    })
})

setInterval(() =>{
    var pack = []
    for(var i in PLAYER_LIST){
        var player = PLAYER_LIST[i]
        pack.push({
            number:player.number
        })
    }
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i]
        socket.emit('newPositions', pack)
    }
}, 1000/25)