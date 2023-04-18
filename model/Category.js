module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("Category", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING,
        },
    },{
        sequelize,
        freezeTableName: true,
        tableName: 'categories'
    });

    return Category;
};