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


// Populate currency list from Currency API
function populateCurrencyNames() {

    pullCrypto(function(cryptoList) {
        var currencyNames = [];

        // Store "Name (Symbol)" for each currency"
        for (var i = 0; i < cryptoList.length; i++) {
            var currencyName = `${cryptoList[i].name} (${cryptoList[i].symbol})`
            currencyNames.push(currencyName);
        }
        // Store in firebase
        database.ref("/currencyNames").set(currencyNames);
    })
}



// Populate the search bar with currency names from firebase
database.ref("/currencyNames").once("value", function (snapshot) {
    var currencyNames = snapshot.val();
    if(!currencyNames){
        populateCurrencyNames();
    } else {
        // $('.typeahead').typeahead({
        //     hint: true,
        //     highlight: true,
        //     minLength: 1
        // },
        //     {
        //         name: 'currencies',
        //         source: substringMatcher(currencyNames)
        //     });
        $('.typeahead').easyAutocomplete({ data: currencyNames, theme: "round"});
    }

  
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


