module.exports = (sequelize, Sequelize) => {
    const News = sequelize.define("News", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING,
        },
    },{
        sequelize,
        freezeTableName: true,
        tableName: 'newses'
    });

    return News;
};