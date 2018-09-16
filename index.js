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

var Player = (id) => {
    var self = {
        health: {
            current: 500,
            total: 500
        },
        x: 50,
        y: 100,
        id: 0,
        number: "" + Math.floor(10 * Math.random())
    }
    if(id == 1)
    {
        var self = {
            health: {
                current: 500,
                total: 500
            },
            x: 500,
            y: 75,
            id: 1,
            number: "" + Math.floor(10 * Math.random())
        }
    }

    return self
}
var i = 0;
var io = require('socket.io')(serv, {});
io.sockets.on('connection', (socket) => {
    if (i <= 2) {
        socket.id = i++
    }
    else {
        i = 1
    }
    SOCKET_LIST[socket.id] = socket;


    var player = Player(socket.id)
    PLAYER_LIST[socket.id] = player

    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.id]
        delete PLAYER_LIST[socket.id]

    })

    socket.on('attack', (userCode) =>{
        while(player.health.current > 0){
            if(userCode === "test"){
                player.health.current -= 10;
            }
        }
        
    })
})

setInterval(() => {
    var pack = []
    for (var i in PLAYER_LIST) {
        var player = PLAYER_LIST[i]
        //console.log(player.x, player.y, player.id)
        pack.push({
            id: player.id,
            x: player.x,
            y: player.y,
            health: player.health,
            number: player.number
        })
    }
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('startingPos', pack)
    }
}, 1000 / 25)

