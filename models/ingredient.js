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

        Ingredients.associate = function(models) {
            // Associating Author with Posts
            // When an Author is deleted, also delete any associated Posts
            Ingredients.hasMany(models.drink_contents, {
                foreignKey: "ingredient_id",
            });
          };


        return Ingredients;
};