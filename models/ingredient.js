module.exports = function (sequelize, DataTypes) {
    var Ingredients = sequelize.define("ingredients",
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
        return Ingredients;
};