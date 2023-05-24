module.exports = (sequelize, Sequelize) => {
    const TrainingVideo = sequelize.define("TrainingVideo", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        videourl: {
            type: Sequelize.STRING,
        },
    },{
        sequelize,
        freezeTableName: true,
        tableName: 'training_videos'
    });

    return TrainingVideo;
};