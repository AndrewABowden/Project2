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

<<<<<<< Updated upstream
        Ingredients.associate = function(models) {
            // Associating Ingredients with drink contents
            Ingredients.hasMany(models.drink_contents, {
                foreignKey: "ingredient_id",
            });
          };

=======
        // Ingredients.associate = function(models) {
        //     // Associating Ingredients with Drinks
        //     // When an Ingredients is deleted, also delete any associated Posts
        //     Ingredients.hasMany(models.Post, {
        //       onDelete: "cascade"
        //     });
        //   };
>>>>>>> Stashed changes

        return Ingredients;
};