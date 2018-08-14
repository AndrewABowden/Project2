var db = require("../models");

module.exports = function (app) {

    // Route to get all drinks
    app.get("/api/drinks", function (req, res) {
        db.drinks.findAll()
            .then(function (dbDrinks) {
                res.json(dbDrinks);
            })
    })

    // Route to get all drink info by drink iD
    app.get("/api/drinks/:id", function (req, res) {
        // build the query string
        var queryString =
            " select drinks.id as dID, drinks.name as dName, drinks.glass_type, drinks.thumb_img_url, drinks.instructions, drinks.description, ingredients.id as iId, ingredients.name as iName, drink_contents.amount " +
            " from drinks, ingredients, drink_contents " +
            " where drinks.id = drink_contents.drink_id and ingredients.id = drink_contents.ingredient_id and drinks.id = " + req.params.id
        " order by drinks.name, drink_contents.id;";

        db.sequelize.query(queryString, { type: db.sequelize.QueryTypes.SELECT })
            .then(function (dbDrink) {
                var drinkJSON =
                {
                    drinkID: dbDrink[0].dID,
                    drinkName: dbDrink[0].dName,
                    glassType: dbDrink[0].glass_type,
                    thumbImg: dbDrink[0].thumb_img_url,
                    instructions: dbDrink[0].instructions,
                    description: dbDrink[0].description
                }
                var ingredientsJSON = [];
                var i = 0;
                dbDrink.forEach(function (drinkIngredient) {
                    ingredientsJSON[i] = {
                        ingridentID: drinkIngredient.iId,
                        ingridentName: drinkIngredient.iName,
                        ingridentAmount: drinkIngredient.amount
                    }
                    i++;
                });
                drinkJSON.contents = ingredientsJSON;
                //   console.log(JSON.stringify(dbDrink));
                res.json(drinkJSON);
            })
    });


    // Route to get all drinks with searched ingredients
    app.get("/api/drinks/ingredient/:ingID", function (req, res) {
        var finalJSON = [];
        var searchParams = req.params.ingID.split("&").join();
        return db.drinks.findAll({
            include: [{
                model: db.drink_contents,
                where: {
                    ingredient_id: {
                        [db.Sequelize.Op.in]: [db.sequelize.literal(searchParams)]
                    }
                }
            }]
        })
            .then(function (dbDrinks) {
                for (var i = 0; i < dbDrinks.length; i++) {
                    finalJSON[i] = {
                        id: dbDrinks[i].id,
                        name: dbDrinks[i].name,
                        imgUrl: dbDrinks[i].thumb_img_url,
                        missingIngCount: 0
                    };
                };
            })
            .then(function () {
                var b = 0;
                finalJSON.forEach(function (aDrink) {
                    db.drink_contents.findAll({
                        where: {
                            drink_id: aDrink.id,
                            ingredient_id: {
                                [db.Sequelize.Op.notIn]: [db.sequelize.literal(searchParams)]
                            }
                        }
                    }).then(function (result) {
                        finalJSON[b].missingIngCount = result.length;
                        if (b === finalJSON.length - 1) {
                            finalJSON.sort(function (a, b) { return a.missingIngCount - b.missingIngCount });
                            res.json(finalJSON);
                        }
                        b++;
                    })
                })
            })
    })
}