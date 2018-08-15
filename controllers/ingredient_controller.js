var db = require("../models");

module.exports = function (app) {
    // Route to get all ingredients
    app.get("/api/ingredients", function (req, res) {
        db.ingredients.findAll()
            .then(function (dbIngredients) {
                res.json(dbIngredients);
            });
    });

    // Route to get ingredient by name
    app.get("/api/ingredients/:name", function (req, res) {
        db.ingredients.findOne({
            where: {
                name: req.params.name
            },
        })
            .then(function (dbIngredients) {
                res.json(dbIngredients);
            });
    });
};

