var drinkIngCount = 1;
var ingredientsNameArray = [];
var ingredientNames;
var ingredientNamesAndIDs;

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
    ingredientNames = data.map((ingredient) => {
        return ingredient.name;
    });
    ingredientNamesAndIDs = data.map((ingredient) => {
        return { "id": ingredient.id, "name": ingredient.name };
    });
    //  console.log(ingredientNames)
    $('.ing-typeahead').typeahead(
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
    //  $('.ing-typeahead').on('typeahead:select', function (ev, ingredientSuggestion) {
    //  $(document).on('typeahead:select', '.ing-typeahead',function (ev, ingredientSuggestion) {
    //      console.log('Selection: ' + ingredientSuggestion);
    //      ingredientsNameArray.push(ingredientSuggestion);
    //      console.log(ingredientsNameArray);
    //  });

});



function typeahead_initialize() {

    $('.ing-typeahead').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'ingredientNames',
            source: substringMatcher(ingredientNames)
        });
}

// ============================================================================
// Typeahead end
function validateIngredient(ingredientName) {
    for (var i = 0; i < ingredientNamesAndIDs.length; i++) {
        if (ingredientNamesAndIDs[i].name.toLowerCase() === ingredientName.toLowerCase()) {
            return ingredientNamesAndIDs[i].id
        }
    }
    return -1;
}


$(function () {

    //Ingredient Section
    $(".add-ingredient").on("submit", function (event) {
        event.preventDefault();
        var ingredientName = $("#ingredientName").val().trim();
        var ingredientDesc = $("#ingredientDesc").val().trim();
        if (ingredientName !== null && ingredientName !== "") {
            var newIng = {
                name: ingredientName,
                description: ingredientDesc
            };

            // Send the POST request.
            $.ajax("/api/ingredients", {
                type: "POST",
                data: newIng
            }).then(
                function () {
                    // Reload the page to get the updated list
                    location.reload();
                }
            );
        }
        else {
            alert("Ingredient name cannot be blank.");
        }
    });

    //Drink Section

    $("#add-additional-ing").on("click", function (event) {
        //  <label form="add-drink">Name: </label><input class="typeahead form-control" type="text" placeholder="Add ingredient"><br>   
        //  <label form="add-drink">Amount: </label>
        drinkIngCount++;
        $('.ing-typeahead').typeahead('destroy');
        $newDiv = $("<div>");
        $newDiv.attr("id", "newIngDiv" + drinkIngCount)
        $newLineBreak = new $("<br>")
        $newLabelIng = new $("<label>");
        $newLabelIng.text("Name: ");
        $newIngInput = new $("<input>");
        $newIngInput.addClass("ing-typeahead");
        $newIngInput.attr("id", "ingredient" + drinkIngCount);
        $newIngInput.attr("type", "text");
        $newIngInput.attr("placeholder", "Ingredient name");
        $newLabelAmt = new $("<label>");
        $newLabelAmt.text("Amount: ");
        $newAmtInput = new $("<input>");
        $newAmtInput.attr("id", "ingredientAmt" + drinkIngCount);
        $newAmtInput.attr("type", "text");
        $newAmtInput.attr("placeholder", "Ingredient amount");
        $newChkBox = $("<input>");
        $newChkBox.attr("id", "delRow" + drinkIngCount);
        $newChkBox.attr("type", "checkbox");
        $newChkBox.addClass("del-row");
        $newLabelDel = new $("<label>");
        $newLabelDel.text("Delete row");

        $newDiv.append($newLineBreak, $newLabelIng, $newIngInput, $newLabelAmt, $newAmtInput, $newLabelDel, $newChkBox);
        $("#drinkIngs").append($newDiv);
        typeahead_initialize();
    });

    //Hide the row if the checkbox is checked.
    $(document).on('change', '.del-row', function (event) {
        //get Row ID
        var rowIDraw = $(this).attr("id");
        var rowID = "#newIngDiv" + rowIDraw.substring(6, rowIDraw.length);
        $(rowID).hide();
    });

    $(".add-drink").on("submit", function (event) {
        event.preventDefault();
        var formOk = true;
        var errorString = "";
        //Make sure the name and instructions are populated
        if ($("#drinkName").val() === null || $("#drinkName").val() === "") {
            errorString += "Drink name cannot be blank.\n";
            formOk = false;
        }
        if ($("#drinkInstructions").val() === null || $("#drinkInstructions").val() === "") {
            errorString += "Drink instructions cannot be blank.\n";
            formOk = false;
        }
        //Validate the ingredients and build the JSON
        var arrayInt = 0;
        var contentsJSON = [];
        for (var i = 1; i <= drinkIngCount; i++) {
            var ingredientString;
            if (!$("#delRow" + i).is(':checked')) {
                ingredientString = $("#ingredient" + i).typeahead("val").trim().toLowerCase();
                var ingID = validateIngredient(ingredientString);
                if (ingID === -1) {
                    errorString += ingredientString + " is not a valid ingredient.\n";
                    formOk = false;
                    i += drinkIngCount + 10;
                }
                else if (ingID !== -1) {
                    contentsJSON[arrayInt] = { id: ingID, amount: $("#ingredientAmt" + i).val().trim() };
                    arrayInt++;
                }
            }
        }
        if (formOk) {
            console.log(JSON.stringify(contentsJSON));
            var newDrink = {
                name: $("#drinkName").val().trim(),
                glass: $("#drinkGlass").val().trim(),
                thumb_url: $("#thumbNail").val().trim(),
                instructions: $("#drinkInstructions").val().trim(),
                description: $("#drinkDesc").val().trim(),
                contents: contentsJSON
            }

           // Send the POST request.
             $.ajax("/api/drinks", {
                 type: "POST",
                 data: newDrink
             }).then(
                 function () {
                     // Reload the page to get the updated list
                     location.reload();
                 }
             );
        }
        else {
            alert(errorString);
        }
    });
});