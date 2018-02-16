## Connect user with socket

file: `config/functions/bootstrap.js`
```javascript
module.exports = cb => {
  // import socket io
  var io = require('socket.io')(strapi.server);
  // listen for user connection
  io.on('connection', function(socket){
    // send message on user connection
    socket.emit('hello', JSON.stringify({message: 'Hello food lover'}));
    // listen for user diconnect
    socket.on('disconnect', () => console.log('a user disconnected'));
  });

  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere

  cb();
};
```


`cp public/index.html public/bakery.html`

file: `public/bakery.html`
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>bakery</title>
  </head>
  <body>
    <!-- add socket.io script -->
    <script src="/socket.io/socket.io.js"></script>
    <script>
      // connect user throught socket
      const socket = io();
      // listen for event name 'hello' & log it
      socket.on('hello', (res) => console.log(res));
    </script>
  </body>
</html>
```
