
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
function pullBeer(){
    var queryURL = "https://api.punkapi.com/v2/beers";
    $.ajax({
    url: queryURL,
    method: "GET"
    }).done(function(beerResponse) {
        console.log(beerResponse);
    });
}

