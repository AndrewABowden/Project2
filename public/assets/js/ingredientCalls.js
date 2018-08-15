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
        replaceDisplay();
        // getIngredients();
        var ingLI = $("<li>").text(ingredientSuggestion);
        var ingDeleteBtn = $("<button>").addClass("ingDelete").text("Delete");
        $(ingLI).append(ingDeleteBtn);
        $(".added-ingredients").append(ingLI);
        $('.typeahead').typeahead('val', '');
    });
});
    // ============================================================================
    // Typeahead end
   

//Get ingredient objects from name and populating ingredientObjArray
function getIngredients() {
    ingredientsNameArray.forEach((ing) => {
        $.get("/api/ingredients/" + ing, function (data) {
            ingredientsObjArray.push(data);
            console.log(ingredientsObjArray)
        });
    })
}

// Replace welcome content w/ ingredient list
function replaceDisplay() {
    if (ingredientsNameArray.length === 1) {
        var ingUL = $("<ul>").addClass("added-ingredients");
        $("#card-Ingredients").replaceWith(ingUL);
    }
}

// Link typeahead search to drink api

// ingredientsObjArray.forEach((obj) => {
//     console.log(obj);
// });
