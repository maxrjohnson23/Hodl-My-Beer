// Populate currency list from Currency API
function populateCurrencyNames() {

    pullCrypto(function (cryptoList) {
        // Store full list in firebase
        database.ref("/cryptoList").set(cryptoList);

    });
}


// Populate the search bar with currency names from firebase
database.ref("/cryptoList").once("value", function (snapshot) {
    let currencyNames = snapshot.val();
    if (!currencyNames) {
        // Refresh data from API
        populateCurrencyNames();
    } else {
        configureSearchBar(currencyNames);
        configurePortfolioSearchBar(currencyNames)
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

////////////  Configuration and functions for the easyautocomplete plugin ////////////
function configureSearchBar(currencyNames) {

    // Config for easyautocomplete plugin
    let config = {
        data: currencyNames,
        getValue: function(element) {
            // display Name (Symbol) for all currencies in the dropdown
            return `${element.name} (${element.symbol})`;
        },
        list: {
            match: {
                enabled: true
            },
            onSelectItemEvent: function () {
                // Get id and symbol of the currency and store as data on the search button
                let $autoComplete = $(".auto-complete");
                let currId = $autoComplete.getSelectedItemData().id;
                let currSymbol = $autoComplete.getSelectedItemData().symbol;
                let $searchBtn = $("#search-currency");
                // Store as data attributes
                $searchBtn.attr("data-curr-id", currId);
                $searchBtn.attr("data-curr-symbol", currSymbol);

            }
        }, theme: "square", cssClasses: "form-control form-control-sm fix-autocomplete input-group"

    };
    $('.auto-complete').easyAutocomplete(config);
    // Fix for working with bootstrap input-group and alignment
    $(".easy-autocomplete").removeAttr("style");
    let $easyContainer = $(".easy-autocomplete-container");
    $easyContainer.css("text-align", "left");
    $easyContainer.css("margin-top", "40px");
}

function configurePortfolioSearchBar(currencyNames) {

    // Config for easyautocomplete plugin
    let config = {
        data: currencyNames,
        getValue: function(element) {
            // display Name (Symbol) for all currencies in the dropdown
            return `${element.name} (${element.symbol})`;
        },
        list: {
            match: {
                enabled: true
            },
            onSelectItemEvent: function () {
                // Get id and symbol of the currency and store as data on the search button
                let $addInput = $("#add-curr-input");
                let currId = $addInput.getSelectedItemData().id;
                let currSymbol = $addInput.getSelectedItemData().symbol;
                let $addBtn = $("#add-curr-btn");
                // Store as data attributes
                $addBtn.attr("data-curr-id", currId);
                $addBtn.attr("data-curr-symbol", currSymbol);

            }
        }, theme: "square", cssClasses: "form-control form-control-sm fix-autocomplete input-group"

    };
    $('#add-curr-input').easyAutocomplete(config);
    // Fix for working with bootstrap input-group and alignment
    $(".easy-autocomplete").removeAttr("style");
    let $easyContainer = $(".easy-autocomplete-container");
    $easyContainer.css("text-align", "left");
    $easyContainer.css("margin-top", "40px");
}
