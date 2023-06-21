module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define("activity", {
      owner: {
        type: DataTypes.STRING,
        allowNull: false
      },
      activityTitle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      activityInfo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      activityKey: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {timestamps: true}, );

    Activity.associate = (models) => {
      Activity.hasMany(models.Level, {
        foreignKey: 'activityId',
        as: 'levels',
      });
    };

    Activity.associate = (models) => {
      Activity.hasMany(models.Group, {
        foreignKey: 'activityId',
        as: 'groups',
      });
    };

    return Activity;
};