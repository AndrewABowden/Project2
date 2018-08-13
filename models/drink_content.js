module.exports = function (sequelize, DataTypes) {
    var Drink_contents = sequelize.define("drink_contents",
        {
            drink_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ingredient_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            amount: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            timestamps: false
        });
        return Drink_contents;
};