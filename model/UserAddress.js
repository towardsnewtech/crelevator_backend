module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User_Address", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        company: {
            type: Sequelize.STRING
        },
        address_first: {
            type: Sequelize.STRING
        },
        address_second: {
            type: Sequelize.STRING,
        },
        postcode: {
            type: Sequelize.STRING,
        },
        city: {
            type: Sequelize.INTEGER
        },
        country: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        }
    },{
        sequelize,
        freezeTableName: true,
        tableName: 'user_addresses'
    });

    return User;
};