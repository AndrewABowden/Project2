var db = require("../models");

module.exports = function(app) {
    
    // Route to get all ingredients
    app.get("/api/ingredients", function(req, res) {
        db.ingredients.findAll()
        .then (function(dbIngredients) {
            res.json(dbIngredients);
        })
    })
};