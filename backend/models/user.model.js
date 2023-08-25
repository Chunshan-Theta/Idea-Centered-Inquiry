module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true, //checks for email format
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // passwordConf: {
      //   type: DataTypes.STRING,
      //   // allowNull: false
      // },
      school: {
        type: DataTypes.STRING,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // activityId: {
      //   allowNull: true,
      //   type: DataTypes.BIGINT
      // },
    }, {timestamps: true}, );
    
    // User.associate = (models) => {
    //   console.log("User.associate✨")
    //   User.belongsTo(models.Activity, {
    //     through: models.ActivityUser,
    //     foreignKey: 'userId'
    //   });
    // }
    User.associate = (models) => {
      User.hasMany(models.Activity, {
        foreignKey: 'owner'
      });
      User.hasMany(models.Node, {
        foreignKey: 'userId'
      });
    };

    return User;
};