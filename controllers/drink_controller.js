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
        /* build the search criteria strings */
        var searchParmamsSorted = req.params.ingID.split("&");
        searchParmamsSorted.sort(function (a, b) { return parseInt(a) - parseInt(b) });

        var searchArrayAnd = ["("]
        var searchArrayOr = ["("]
        for (var i = 1; i <= searchParmamsSorted.length; i++) {
            searchArrayAnd[i] = "(ingredient_id <> " + parseInt(searchParmamsSorted[i - 1]) + ") and ";
            searchArrayOr[i] = "(ingredient_id = " + parseInt(searchParmamsSorted[i - 1]) + ") or ";
        }
        searchArrayAnd.push(")");
        searchArrayOr.push(")");

        // Turn array to string
        var searchStringAnd = searchArrayAnd.join();
        var searchStringOr = searchArrayOr.join();

        //remove the commas
        searchStringAnd = searchStringAnd.replace(/[,]+/g, "").trim();
        searchStringOr = searchStringOr.replace(/[,]+/g, "").trim();

        //remove the extra "and" and add the closing right parenthesis
        searchStringAnd = searchStringAnd.substring(0, searchStringAnd.length - 6);
        searchStringAnd += ")";

        //remove the extra "or" and add the closing right parenthesis
        searchStringOr = searchStringOr.substring(0, searchStringOr.length - 5);
        searchStringOr += ")";

        /* search criteria array strings */

        /* build SQL String */
        var queryString = "SELECT distinct " +
            "drinks.id as drinkID, drinks.name, drinks.thumb_img_url, " +
            "(select count(ingredient_id) from drink_contents where drink_id = drinkID AND " + searchStringAnd + " group by drinkID) as missingIngredient " +
            "FROM drinks AS drinks INNER JOIN drink_contents AS drink_contents ON drinks.id = drink_contents.drink_id " +
            " AND " + searchStringOr + ";";

        /* SQL String built */

        db.sequelize.query(queryString, { type: db.sequelize.QueryTypes.SELECT })
            .then(function (dbDrinks) {
                for (var i = 0; i < dbDrinks.length; i++) {
                    finalJSON[i] = {
                        id: dbDrinks[i].drinkID,
                        name: dbDrinks[i].name,
                        imgUrl: dbDrinks[i].thumb_img_url,
                        missingIngCount: dbDrinks[i].missingIngredient
                    };
                    //Swap nulls for 0s
                    if (finalJSON[i].missingIngCount === null) {
                        finalJSON[i].missingIngCount = 0;
                    }

                }
                // Sort and return the array
                finalJSON.sort(function (a, b) { return a.missingIngCount - b.missingIngCount });
                res.json(finalJSON);
            })
    })

    // Route for a drink
    app.post("/api/drinks", function (req, res) {
        //Check to see if the ingredient exists
        db.drinks.findOne({
            where: { name: req.body.name },
        }).then(function (drink) {
            if (drink != null) {
                res.status(200).send("Drink Exists");
            }
            else {
                /* magic goes here */
                var drinkName = req.body.name;
                var glassType = req.body.glass;
                var thumbURL = req.body.thumb_url;
                var instructions = req.body.instructions;
                var desc = req.body.description;
                if (desc === null || desc === "") {
                    desc = null;
                }
                db.drinks.create({
                    name: drinkName,
                    glass_type: glassType,
                    thumb_img_url: thumbURL,
                    instructions: instructions,
                    description: desc
                }
                ).then(function (newDrink){
                    req.body.contents.forEach(function (content){
                        addContents(newDrink.id,content.id,content.amount,function(){});
                    })
                }).then(function (){
                    res.status(200).end();
                })
            }
        }).catch(function (err) {
            throw err;
        })
    });

    function addContents(drinkId,ingID,amount,fn)
    {
        db.drink_contents.create({
            drink_id: drinkId,
            ingredient_id: ingID,
            amount: amount
        }
        ).then(function ()
        {
            fn()
        }).catch(function(err){
            throw err;
        });
    }
}
