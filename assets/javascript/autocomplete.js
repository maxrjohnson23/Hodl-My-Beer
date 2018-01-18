
// Populate currency list from Currency API
function populateCurrencyNames() {

    pullCrypto(function (cryptoList) {
        let currencyNames = [];

        // Store "Name (Symbol)" for each currency"
        for (let i = 0; i < cryptoList.length; i++) {
            let currencyName = `${cryptoList[i].name} (${cryptoList[i].symbol})`;
            currencyNames.push(currencyName);
        }
        // Store in firebase
        database.ref("/currencyNames").set(currencyNames);
    })
}


// Populate the search bar with currency names from firebase
database.ref("/currencyNames").once("value", function (snapshot) {
    let currencyNames = snapshot.val();
    if (!currencyNames) {
        // Refresh data from API
        populateCurrencyNames();
    } else {
        configureSearchBar(currencyNames);
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

////////////  Configuration and functions for the easyautocomplete plugin ////////////
function configureSearchBar(currencyNames) {
    // Config for easyautocomplete plugin
    let config = {
        data: currencyNames, list: {
            match: {
                enabled: true
            }
        }, theme: "square", cssClasses: "form-control form-control-sm fix-autocomplete input-group",

    };
    $('.auto-complete').easyAutocomplete(config);
    // Fix for working with bootstrap input-group and alignment
    $(".easy-autocomplete").removeAttr("style");
    let $easyContainer = $(".easy-autocomplete-container");
    $easyContainer.css("text-align", "left");
    $easyContainer.css("margin-top", "40px");
}
