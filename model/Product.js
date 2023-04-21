module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("Product", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        sub_category_id : {
            type : Sequelize.INTEGER,
        },
        contact_no : {
            type : Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        price : {
            type : Sequelize.STRING
        },
        availability : {
            type : Sequelize.TEXT
        },
        features : {
            type : Sequelize.TEXT
        },
        specifications : {
            type : Sequelize.TEXT
        },
        image: {
            type: Sequelize.STRING,
        },
    },{
        sequelize,
        freezeTableName: true,
        tableName: 'products'
    });

    return Product;
};