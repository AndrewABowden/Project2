var db = require("../models");

module.exports = function(app) {

    // Route to get all drinks
    app.get("/api/drinks", function(req, res) {
        db.drinks.findAll()
        .then (function(dbDrinks) {
            res.json(dbDrinks);
        })
    })
};