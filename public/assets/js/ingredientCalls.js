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
        console.log("SELECTED: " + ingredientSuggestion)
        ingredientsNameArray.push(ingredientSuggestion);
        getIngredients()
        var ingSpan = $("<span>").text(ingredientSuggestion);
        $(".ingredient-list").append(ingSpan);
    })
});
// ============================================================================
// Typeahead end

function getIngredients() {
    ingredientsNameArray.forEach((ing) => {
        $.get("/api/ingredients/" + ing, function (data) {
            ingredientsObjArray.push(data);
        })
        console.log(ingredientsObjArray)
    })
}