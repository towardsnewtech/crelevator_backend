module.exports = (sequelize, Sequelize) => {
    const Pdfs = sequelize.define("Pdfs", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING,
        },
    },{
        sequelize,
        freezeTableName: true,
        tableName: 'pdfs_material'
    });

    return Pdfs;
};