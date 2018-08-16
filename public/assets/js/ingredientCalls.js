var ingredientsNameArray = [];
var ingredientsObjArray = [];

// Typeahead start
// ============================================================================
var substringMatcher = function (strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};

$.get("/api/ingredients", function (data) {
    var ingredientNames = data.map((ingredient) => {
        return ingredient.name;
    });
    $('#ingredients-menu .typeahead').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'ingredientNames',
            source: substringMatcher(ingredientNames)
        }
    );
    // Listener
    $('#ingredients-menu .typeahead').on('typeahead:select', function (ev, ingredientSuggestion) {
        ingredientsNameArray.push(ingredientSuggestion);
        replaceIngredientsDisplay();
        getIngredients(ingredientSuggestion);
        var ingLI = $("<li>").text(ingredientSuggestion);
        var ingDeleteBtn = $("<button>").addClass("ingDelete").text("Delete");
        $(ingLI).append(ingDeleteBtn);
        $(".added-ingredients").append(ingLI);
        $('.typeahead').typeahead('val', '');
        drinksDisplay();
    });
});
// ============================================================================
// Typeahead end

//Get ingredient objects from name and populating ingredientObjArray
function getIngredients(ing) {
    $.get("/api/ingredients/" + ing, function (data) {
        ingredientsObjArray.push(data);
    });
}

// Replace welcome content w/ ingredient list
function replaceIngredientsDisplay() {
    if (ingredientsNameArray.length === 1) {
        var ingUL = $("<ul>").addClass("added-ingredients");
        $("#card-Ingredients").replaceWith(ingUL);
    }
}

// Link typeahead and drink_controller
function drinksDisplay() {
    var ingredientsID = ingredientsObjArray.map((ing) => {
        return ing.id
    }).join('&');

    $.get("/api/drinks/ingredient/" + ingredientsID)
        .then((data) => {
            $("#leftCard").empty();
            $("#rightCard").empty();
            data.forEach((drink) => {
                //do some jQuery here to show the drink
                console.log(drink);
                if (drink.missingIngCount === 0) {
                    // Drinks you can make
                    // BUTTON --> drink name
                    var drinkList = $("<button>").addClass("btn btn-link drinkList")
                    $(drinkList).attr("data-toggle", "collapse").attr("data-target", "#drink-info" + drink.id).attr("aria-expanded", "false").attr("aria-controls", "drink-info" + drink.id);
                    $(drinkList).text(drink.name);
                    // DIV --> drink info
                    var drinkInfo = $("<div>").addClass("collapse").attr("id", "drink-info" + drink.id).text(drink.name);
                    $("#leftCard").append(drinkList, drinkInfo);
                } else if (drink.missingIngCount < 3 && drink.missingIngCount > 0) {
                    //Drinks you can't make yet
                    // BUTTON --> drink name
                    var almostDrinkList = $("<button>").addClass("btn btn-link almostDrinkList")
                    $(almostDrinkList).attr("data-toggle", "collapse").attr("data-target", "#drink-info" + drink.id).attr("aria-expanded", "false").attr("aria-controls", "drink-info" + drink.id);
                    $(almostDrinkList).text(drink.name);
                    // DIV --> drink info
                    var almostDrinkInfo = $("<div>").addClass("collapse").attr("id", "drink-info" + drink.id).text(drink.name);
                    $("#rightCard").append(almostDrinkList, almostDrinkInfo);
                }
            });
        });
}
