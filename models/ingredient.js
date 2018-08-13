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
            // Associating Ingredients with drink contents
            Ingredients.hasMany(models.drink_contents, {
                foreignKey: "ingredient_id",
            });
          };


        return Ingredients;
};