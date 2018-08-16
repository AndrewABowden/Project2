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

    // Route for adding an ingredient
    app.post("/api/ingredients", function (req, res) {
        //Check to see if the ingredient exists
        db.ingredients.findOne({
            where: { name: req.body.name },
        }).then(function (ingredient) {
            if(ingredient!=null)
            {
                res.status(200).send("Ingredient exists.");
            }
            else
            {
                var desc = req.body.description;
                if(desc === null || desc ==="")
                {
                    desc = null
                }
                db.ingredients.create({
                    name: req.body.name,
                    description: desc
                }).then(function () {
                    res.status(200).end();
                })
            }
        }).catch(function (err) {
            throw err;
        })
    })
};
