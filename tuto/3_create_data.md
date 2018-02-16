## Create data for bakery model from frontend

file: `public/bakery.html`
```html
<section>
  <h1>Add new delicious food</h1>

  <label for="name">
    <span>Name :</span>
    <!-- name of the bakery entity -->
    <input type="text" name="name" id="name" />
  </label>

  <label for="rating">
    <span>Rating :</span>
    <!-- rating of the bakery entity -->
    <select name="rating" id="rating">
      <option value="1">1 star</option>
      <option value="2">2 stars</option>
      <option value="3">3 stars</option>
      <option value="4">4 stars</option>
      <option value="5">5 stars</option>
    </select>
  </label>

  <button id="add">Add</button>
</section>
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();

  // to get the value name to create an entity
  const name = document.getElementById('name');
  // to get the value rating to create an entity
  const rating = document.getElementById('rating');
  // to listen to click event and send our request
  const add = document.getElementById('add');

  add.addEventListener('click', () => { // listen to click event
    // send a post request with our input value
    fetch('/bakery', {
        method: 'post',
        headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
        body: `name=${name.value}&rating=${rating.value}`
      })
      .then((res) => {
          if (res.status !== 200) return;
          res.json().then((data) => console.log(data));
        }
      )
      .catch((err) => console.log('Fetch Error :-S', err));
  });
</script>
```
