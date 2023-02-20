const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const assetPath = path.join(__dirname, 'index.html');

app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist/'));


app.get('/', (req, res) => {
   res.sendFile(assetPath);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
});


server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});