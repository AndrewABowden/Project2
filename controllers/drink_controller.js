var db = require("../models");

module.exports = function (app) {

    // Route to get all drinks
    app.get("/api/drinks", function (req, res) {
        db.drinks.findAll()
            .then(function (dbDrinks) {
                res.json(dbDrinks);
            })
    });

    // Route to get drink by name
    app.get("/api/drinks/:name", function (req, res) {
        db.drinks.findOne({
            where: {
                name: req.params.name
            },
        })
            .then(function (dbDrinks) {
                res.json(dbDrinks);
            });
    });

    // Route to get all drinks with searched ingredients
    app.get("/api/drinks/:ingID", function (req, res) {
        var searchParams = req.params.ingID.split("&");
        db.drinks.findAll({
            include: [{
                model: db.drink_contents,
                where: { ingredient_id: searchParams[0] }
            }]
        })
            .then(function (dbDrinks) {
                res.json(dbDrinks);
            })
    })
};