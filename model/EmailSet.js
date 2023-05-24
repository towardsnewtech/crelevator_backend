module.exports = (sequelize, Sequelize) => {
    const EmailSet = sequelize.define("emailset", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        type: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING
        },
        emailserver: {
            type: Sequelize.STRING
        },
        emailuser: {
            type: Sequelize.STRING
        },
        isused: {
            type: Sequelize.BOOLEAN
        }
    },{
        sequelize,
        freezeTableName: true,
        tableName: 'email_set'
    });

    return EmailSet;
};