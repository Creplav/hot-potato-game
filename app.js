var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = [];
var sockets = [];


app.get('/', function (req, res) {
   res.sendFile(__dirname + '/login.html');
});

app.get('/lobby', function(req, res){
    res.sendFile(__dirname + '/lobby.html');
});

app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/game.html');
});



io.on('connection', function(socket){
   sockets.push(socket);

   socket.on('disconnect', function(){
       sockets.splice(sockets.indexOf(socket), 1);
   });

   socket.on('user logged in', function(userName){
       var player = new Object();
       player.name = userName;
       player.socket = socket;
       player.hasPotato = false;

       players.push(player);
       console.log('A user has logged in!');
       console.log(players);
   });

   socket.on('start game', function(){
       players[0].hasPotato = true;
   });

   socket.on('get users', function(){
       console.log(players);
   });

   socket.on('pass potato', function(player){

        //will cycle through once and end with a index out of bounds
        for(var i = 0; i < players.length; i++){
            if(players[i].hasPotato){
                console.log('player with potato: ' + players[i]);
                players[i].hasPotato = false;
                var player = players[i + 1].hasPotato = true;
                socket.to(player.getSocket()).emit('receive potato');
                break;
            }
        }
   });
});

function broadcast(event, data){
    sockets.forEach(function(socket){
        socket.emit(event, data);
    });
}

http.listen(process.env.PORT || 3000, function(){
    var address = http.address();
   console.log('Server listening on port: ' + address.port);
});