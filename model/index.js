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

db.Category.hasMany(db.SubCategory, { foreignKey: 'category_id' });
db.SubCategory.belongsTo(db.Category, { foreignKey: 'category_id' });

module.exports = db;
