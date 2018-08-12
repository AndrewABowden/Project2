module.exports = function (sequelize, DataTypes) {
    var ingredients = sequelize.define("ingredient",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1],
                }
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            }
        },
        {
            timestamps: false
        });
};