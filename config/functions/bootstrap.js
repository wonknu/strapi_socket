'use strict';
// socket.emit('hello', JSON.stringify({message: 'Hello food lover'}));
module.exports = cb => {
  var io = require('socket.io')(strapi.server);
  var users = [];

  io.on('connection', socket => {
    socket.user_id = (Math.random() * 100000000000000); // not so secure
    users.push(socket); // save the socket to use it later
    socket.on('disconnect', () => {
      users.forEach((user, i) => {
        if(user.user_id === socket.user_id) users.splice(i, 1); // delete saved user when they disconnect
      });
    });
  });

  strapi.io = io;
  strapi.emitToAllUsers = food => io.emit('food_ready', food); // send to all users connected
  cb();
};
