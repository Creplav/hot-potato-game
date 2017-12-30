var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/login.html');
});

app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/game.html');
});

var player = {
    name: "No Name"
};

io.on('connection', function(socket){
   console.log('A user connected!');
});

http.listen(3000, function(){
   console.log('listening on: *:3000');
});