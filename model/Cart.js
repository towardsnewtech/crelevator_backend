module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define("Cart", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userid: {
            type: Sequelize.INTEGER
        },
        productid: {
            type: Sequelize.INTEGER,
        },
    },{
        sequelize,
        freezeTableName: true,
        tableName: 'cart'
    });

    return Cart;
};