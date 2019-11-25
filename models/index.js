var path = require('path');
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var db = {};

var sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Tobacco = require('./tobacco')(sequelize, Sequelize);
db.Review = require('./review')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);


//관계 설정
db.Tobacco.hasMany(db.Review,{foreignKey:'tobacco_id', onDelete: 'cascade'})
db.User.hasMany(db.Tobacco,{foreignKey:'user_id', onDelete: 'cascade'})

// db.Admin = require('./admin')(sequelize, Sequelize);
// db.Seller = require('./seller')(sequelize, Sequelize);
// db.Customer = require('./customer')(sequelize, Sequelize);
// db.Restaurants = require('./restaurants')(sequelize, Sequelize);
// db.Menu = require('./menu')(sequelize, Sequelize);
// db.Cart = require('./cart')(sequelize, Sequelize);
// db.Review = require('./review')(sequelize, Sequelize);
// db.Payment_log = require('./payment_log')(sequelize, Sequelize);

// //관계설정
// db.Restaurants.hasMany(db.Menu,{foreignKey:'restaurant_id'});
// db.Seller.hasMany(db.Restaurants, {foreignKey: 'seller_id'});

// //review-restaurant 다대다 관계설정.
// db.Restaurants.belongsToMany( db.Review, {
//     through: 'Restaurants_Review',
//     foreignKey : 'restaurants_id'
// });
// db.Review.belongsToMany( db.Restaurants, {
//     through: 'Restaurants_Review',
//     foreignKey : 'review_id'
// });

// db.Cart.hasMany(db.Menu,{foreignKey: 'cart_id'});
// db.Customer.hasOne(db.Cart,{foreignKey:'user_id'});
// db.Customer.hasMany(db.Payment_log,{foreignKey:'customer_id'});
// db.Restaurants.hasMany(db.Payment_log,{foreignKey:'seller_id'});
// db.Restaurants.hasMany(db.Cart,{foreignKey:'resaurant_id'});

module.exports = db;



