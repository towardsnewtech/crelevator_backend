module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("Admin", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            
        },
        password: {
            type: Sequelize.STRING,
        },
        token: {
            type: Sequelize.STRING
        },
    },{
        sequelize,
        freezeTableName: true,
        tableName: 'admins'
    });

    return Admin;
};