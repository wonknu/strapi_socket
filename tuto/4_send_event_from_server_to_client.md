## Send socket io event to client after creation of bakery

file: `config/functions/bootstrap.js`
```javascript
module.exports = cb => {
  var io = require('socket.io')(strapi.server);
  var users = [];

  io.on('connection', socket => {
    socket.user_id = (Math.random() * 100000000000000); // not so secure
    users.push(socket); // save the socket to use it later
    socket.on('disconnect', () => {
      users.forEach((user, i) => {
        // delete saved user when they disconnect
        if(user.user_id === socket.user_id) users.splice(i, 1);
      });
    });
  });

  strapi.io = io;
  // send to all users connected
  strapi.emitToAllUsers = food => io.emit('food_ready', food);
  cb();
};
```
