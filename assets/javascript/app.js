
//global var
//firebase

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD7p-vvXrxOOb8X_0MJiVekPqAVUKW4p70",
    authDomain: "hodl-my-beer.firebaseapp.com",
    databaseURL: "https://hodl-my-beer.firebaseio.com",
    projectId: "hodl-my-beer",
    storageBucket: "hodl-my-beer.appspot.com",
    messagingSenderId: "946695384034"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// pulling crypto data
function pullCrypto(callBack) {
    var queryURL = "https://api.coinmarketcap.com/v1/ticker/";
    $.ajax({
        url: queryURL,
        method: "GET",
        success: callBack
    }).done(function (cryptoResponse) {
        console.log(cryptoResponse);
    });
}

function pullCryptoSingleCurrency(currId, callBack) {
    var queryURL = `https://api.coinmarketcap.com/v1/ticker/${currId}/`;
    $.ajax({
        url: queryURL,
        method: "GET",
        success: callBack
    });
}

// pulling beer data
// beer variables
var abv = Math.abs(5.8); //5.8 is a test, this will eventually be our % change from crypto
var abvLower = Math.floor(abv); //create range for queryURL
var abvHigher = Math.ceil(abv);
var filterResult = []; // array for collecting all results' ABVs
var beerArray = [];//array where % for crypto matches returned ABVs
var roundingArray = []; // for use in rounding when % crypto !== any returned ABVs

function pullBeer(){
    var queryURL = "https://api.punkapi.com/v2/beers?abv_gt=" + abvLower + "&abv_lt=" + abvHigher;
    $.ajax({
    url: queryURL,
    method: "GET"
    }).done(function(beerResponse) {
        console.log(beerResponse);
        for (let i = 0; i < beerResponse.length; i++){
            var returnABV = beerResponse[i].abv;
            filterResult.push(returnABV); //collecting all returned ABVs
            if (returnABV === abv) { //where returned ABV matches % from crypto
                beerArray.push(i);  //add to beerArray
            }
        }
        console.log(filterResult);
        console.log(beerArray);
        for (i = 0; i < beerArray.length; i++) {
            console.log(beerResponse[i]); // print results for matching beers
        }
    });
}

$("#search-currency").on("click", function() {
    // Get value from data attribute
    let currId = $(this).attr("currency");
    if(currId) {
        pullCryptoSingleCurrency(currId, setCurrencyStatsOnUI);
    }
});

function setCurrencyStatsOnUI(data) {
    // format from API
    let currencyData = data[0];

    let percentHour = currencyData.percent_change_1h;
    let percentDay = currencyData.percent_change_24h;
    let percentWeek = currencyData.percent_change_7d;

    console.log("hour:" + percentHour);
    console.log("day:" + percentDay);
    console.log("week:" + percentWeek);

}



