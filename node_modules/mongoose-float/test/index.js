var should = require('should');
var mongoose = require('mongoose');
var lib = require('../lib/index.js');

var Float = lib.loadType(mongoose);
var UserSchema = mongoose.Schema({ balance: { type: Float } });
var User = mongoose.model('User', UserSchema);

describe('SchemaTypes Float', function () {
	describe('mongoose-float', function () {
		it('should contain loadType method', function () {
			var module = require('../lib/index.js');
			module.should.have.ownProperty('loadType');
			module.loadType.should.be.a.Function;
		});
	});

	describe('mongoose.Schema.Types.Float', function () {
		before(function () {
			require('../lib/index.js').loadType(mongoose);
		});
		it('mongoose.Schema.Types should contain Float type property', function () {
			mongoose.Schema.Types.should.have.ownProperty('Float');
		});
		it('mongoose.Schema.Types.Float should contain the constructor', function () {
			mongoose.Schema.Types.Float.should.be.a.Function;
		});
		it('mongoose.Schema.Types.Float should contain cast method', function () {
			mongoose.Schema.Types.Float.prototype.cast.should.be.a.Function;
		});
	});

	describe('new Schema', function () {
		it('should store positive value', function () {
			var user = new User({ balance: 1000 });
			user.balance.should.equal(1000.00);
		});
		it('should store negative value', function () {
			var user = new User({ balance: -1000 });
			user.balance.should.equal(-1000.00);
		});
		it('should not save all of the fractional digits, just 2 of them (default value)', function () {
			var user = new User({ balance: 100.111111111 });
			user.balance.should.equal(100.11);
		});
		it('should not save all of the fractional digits, just 4 of them (passed argument)', function () {
			var NewFloat = lib.loadType(mongoose, 4);
			var ProductSchema = mongoose.Schema({ price: { type: NewFloat } });
			var Product = mongoose.model('Product', ProductSchema);

			var product = new Product({ price: 200.222222222 });
			product.price.should.equal(200.2222);
		});
		it('should throw error if the value is not Number type', function () {
			var user = new User({ balance: '1000' });
			user.validate(function (err) {
				should.exist(err);

				done();
			});
		});
	});
});
