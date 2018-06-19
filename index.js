var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var keys = require('./keys');

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

  socket.on('keycode', function(msg){
    console.log('keydown: ' + msg);
    keycodeObj = keys.checkKey(msg);
    console.dir(keycodeObj['alias'])
  });
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
