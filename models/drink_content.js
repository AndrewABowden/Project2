module.exports = function (sequelize, DataTypes) {
    var drink_contents = sequelize.define("drink_content",
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
};