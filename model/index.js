const config = require('../config').database;
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.db, config.user, config.password, {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require("./User.js")(sequelize, Sequelize);
db.UserAddress = require("./UserAddress.js")(sequelize, Sequelize);
db.Admin = require("./Admin.js")(sequelize, Sequelize);
db.Category = require("./Category.js")(sequelize, Sequelize);
db.SubCategory = require("./SubCategory.js")(sequelize, Sequelize);
db.Product = require("./Product.js")(sequelize, Sequelize);
db.TrainingVideo = require("./TrainingVideo.js")(sequelize, Sequelize);
db.Faq = require("./Faq.js")(sequelize, Sequelize);
db.News = require("./News.js")(sequelize, Sequelize);
db.Pdf = require("./Pdf.js")(sequelize, Sequelize);
db.EmailSet = require('./EmailSet')(sequelize, Sequelize);
db.Cart = require('./Cart')(sequelize, Sequelize) ;

db.Category.hasMany(db.SubCategory, { foreignKey: 'category_id' });
db.SubCategory.belongsTo(db.Category, { foreignKey: 'category_id' });
db.SubCategory.hasMany(db.Product, { foreignKey: 'sub_category_id' });
db.Product.belongsTo(db.SubCategory, { foreignKey: 'sub_category_id' });

db.User.hasOne(db.UserAddress, { foreignKey: 'user_id' });
db.UserAddress.belongsTo(db.User, { foreignKey: 'user_id' });

db.Cart.belongsTo(db.User, {foreignKey: 'userid'});
db.User.hasMany(db.Cart, {foreignKey: 'userid'}) ;
db.Cart.belongsTo(db.Product, {foreignKey: 'productid'});
db.Product.hasMany(db.Cart, {foreignKey: 'productid'});

module.exports = db;
