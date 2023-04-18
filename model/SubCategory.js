module.exports = (sequelize, Sequelize) => {
    const SubCategory = sequelize.define("SubCategory", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        category_id : {
            type:  Sequelize.INTEGER,
            primaryKey: false,
            autoIncrement:false,
            allowNull:false
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
        tableName: 'sub_categories'
    });

    return SubCategory;
};