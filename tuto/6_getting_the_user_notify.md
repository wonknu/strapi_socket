## Getting the event

file: `public/bakery.html`

add a div#food to write messages to users
```html
<div id="food"></div>

```

getting the event
```javascript
const food = document.getElementById('food');
socket.on('food_ready', res => food.innerHTML += `<div>- ${res.name} is ${res.rating}/5 so delicious</div>`);

```
