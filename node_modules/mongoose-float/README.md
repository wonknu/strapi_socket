## What's mongoose-float?
[![npm version](https://badge.fury.io/js/mongoose-float.svg)](https://www.npmjs.com/package/mongoose-float)

This library can solve one well known problem with JavaScript Number arithmetic imprecise, when, for example, 3.3 * 3 becomes 9.899999999999999, ugly.
This can occur when you try to save double values in Mongo DB, it can be balance, discounts etc.

#### Getting start
```
npm install mongoose-float
```

#### Basic usage
```javascript
var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);

var UserSchema = mongoose.Schema({ balance: { type: Float } });
var User = mongoose.model('User', UserSchema);

var user = new User({ balance: 100.111111111 });

// Output: user.balance = 100.11
```


#### Specify the count of fractional digits
```javascript
var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 4);

var ProductSchema = mongoose.Schema({ price: { type: Float } });
var Product = mongoose.model('Product', ProductSchema);

var product = new Product({ price: 200.222222222 });

// Output: product.price = 200.2222
```


### License
    The MIT License (MIT)
    Copyright (c) 2016 Ivan Kitaev

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.