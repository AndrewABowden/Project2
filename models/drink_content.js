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



    Drink_contents.associate = function (models) {
        // A drink_content can't be created without a drink/ingredient due to the foreign key constraint
        Drink_contents.belongsTo(models.drinks,
            {
                as: "drinkContents",
                foreignKey: "drink_id"
            });

            Drink_contents.belongsTo(models.ingredients,
                {
                    as: "ingredientContents",
                    foreignKey: "ingredient_id"
                });
         
    };


    return Drink_contents;
};