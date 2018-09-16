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
        y: 150,
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
            x: 370,
            y: 28,
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
            if(userCode === "test"){
                    player.health.current -= 10;
            }
    })

    //socket.emit('Instructions', 'Create a for loop that starts i at 0 and loops 3 times.');
})

setTimeout(function(){
    //io.sockets.(PLAYER_LIST[1]).emit('Instructions', 'Create a for loop that starts i at 0 and loops 3 times.');
    //io.sockets.socket(PLAYER_LIST[2]).emit('Instructions', 'You are player 2.');
}, 2000);


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

