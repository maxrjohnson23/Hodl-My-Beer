
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
function pullCrypto(){
    var queryURL = "https://api.coinmarketcap.com/v1/ticker/";
    $.ajax({
    url: queryURL,
    method: "GET"
    }).done(function(cryptoResponse) {
    console.log(cryptoResponse);
    });
}

// pulling beer data
// beer variables 
var abv = Math.abs(5.8);
var abvLower = Math.floor(abv);
var abvHigher = Math.ceil(abv);
var filterResult = [];
var beerArray = [];
var roundingArray = [];

function pullBeer(){
    var queryURL = "https://api.punkapi.com/v2/beers?abv_gt=" + abvLower + "&abv_lt=" + abvHigher;
    $.ajax({
    url: queryURL,
    method: "GET"
    }).done(function(beerResponse) {
        console.log(beerResponse);
        for (i = 0; i < beerResponse.length; i++){
            var returnABV = beerResponse[i].abv
            filterResult.push(returnABV);
            if (returnABV === abv) {
                beerArray.push(i);
            } 
        }
        console.log(filterResult);
        console.log(beerArray);
        for (i = 0; i < beerArray.length; i++) {
            console.log(beerResponse[i]);
        }
    });
}

