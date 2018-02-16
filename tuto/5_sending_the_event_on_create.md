## On the controller send event after a bakery entity is created

file : `api/bakery/controllers/Bakery.js`
```javascript
create: async (ctx) => {
  const data = await strapi.services.bakery.add(ctx.request.body);

  // Send 201 `created`
  ctx.created(data);

  // NEW LINE: call our method emitToAllUsers and pass it body request
  strapi.emitToAllUsers(ctx.request.body);
},

```
