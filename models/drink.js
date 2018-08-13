module.exports = function (sequelize, DataTypes) {
    var Drinks = sequelize.define("drinks",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1]
                }
            },
            glass_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            thumb_img_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            instructions: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            }
        },
        {
            timestamps: false
        });
        return Drinks;
};