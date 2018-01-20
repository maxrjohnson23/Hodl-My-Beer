


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

// Create variable to reference access google authentication
var provider = new firebase.auth.GoogleAuthProvider();
var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

// USER AUTHENTICATION
var btnLogin = $('.btnLogin');
var btnSignout = $('.btnSignout');

btnLogin.on('click', function(e){
    $('.btnSignout').removeClass('d-none');
    $('.btnLogin').addClass('d-none');
    // Sign In
    firebase.auth().signInWithRedirect(provider).then(function(result) {
        console.log('Successfully signed in');
        var token = result.credential.accessToken;
    }).catch(function(e) {
        console.log(e.message)
    });
});

btnSignout.on('click', function(e){
    // Sign Out
    firebase.auth().signOut().then(function() {
        console.log('Successfully signed out');
        $('.btnSignout').addClass('d-none');
        $('.btnLogin').removeClass('d-none');
    }).catch(function(e) {
        console.log(e.message)
    });
});

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log(firebaseUser);
        // name = user.displayName;
        // email = user.email;
        // photoUrl = user.photoURL;
        // emailVerified = user.emailVerified;
        // uid = user.uid;
        // console.log("name: " + name);
        // console.log("email: " + email);
        // console.log("photoURL: " + photoUrl);
        // console.log("emailverified: " + emailVerified);
        // console.log("uid: " + uid);
    } else {
        console.log('not logged in');
    };
});

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
    let currId = $(this).attr("data-curr-id");
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



