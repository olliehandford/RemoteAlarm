const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


let rooms = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  socket.on('welcomeDesktop', (code) => {
    if(!rooms.includes(code))
    {
        console.log('user created and connected to room code: ' + code);
        rooms.push(code);
    }
    else {
        console.log('user connected and joined room code: ' + code);
        io.emit('recieveNewUser', {roomCode: code});
    }
    
  });

   socket.on('sendVibration', (vibObject) => {
        console.log('vibration sent in room: ' + vibObject.roomCode + ' for ' + vibObject.ms + 'ms');
        io.emit('recieveVibration', {roomCode: vibObject.roomCode, ms: vibObject.ms});
  });

   socket.on('sendAlarm', (alarmObject) => {
        console.log('alarm sent in room: ' + alarmObject.roomCode + ' for ' + alarmObject.dateTime + 'ms with the name ' + alarmObject.alarmName);
        io.emit('recieveAlarm', alarmObject);
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});