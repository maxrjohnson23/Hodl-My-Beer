

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
var provider = new firebase.auth.GoogleAuthProvider();

// USER AUTHENTICATION


var txtEmail = $('.txtEmail');
var txtPassword = $('.txtPassword');
var btnLogin = $('.btnLogin');
var btnSignUp = $('.btnSignUp');
var btnLogout = $('.btnLogout');

var provider = new firebase.auth.GoogleAuthProvider();

btnLogin.on('click', function(e){
    // Get email and pass
    var email = txtEmail.val();
    var password = txtPassword.val();
    var auth = firebase.auth();
    // Sign In
    firebase.auth().signInWithRedirect(provider).then(function(result) {
       var token = result.credential.accessToken;
      var user = result.user;
    }).catch(function(e) {
        console.log(e.message)
    });

    // var promise = auth.signInWithEmailAndPassword(email, password);
    // promise.catch(e => console.log(e.message));
});



// Add signup event
// btnSignUp.on('click', function(e){
//     // Get email and pass
//     var email = txtEmail.val();
//     var password = txtPassword.val();
//     var auth = firebase.auth();
//     // Sign In
//     var promise = auth.createUserWithEmailAndPassword(email, password);
//     promise.catch(e => console.log(e.message));
// });

// btnLogout.on('click', function(e) {
//     firebase.auth().signOut();
// });

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log('not logged in');
    }
});

// $('.navbar-btn').on('click',function() {
//     console.log('button');
//     firebase.auth().signInWithPopup(provider).then(function(result) {
//         // This gives you a Google Access Token. You can use it to access the Google API.
//         var token = result.credential.accessToken;
//         // The signed-in user info.
//         var user = result.user;
//         // ...
//         }).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // The email of the user's account used.
//         var email = error.email;
//         // The firebase.auth.AuthCredential type that was used.
//         var credential = error.credential;
//         // ...
//         });
// });

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

var percents = {
    day: 5.5,
    week: 5.5
};

// pulling beer data
// beer variables
var filterResult = []; // array for collecting all results' ABVs
var beerArray = [];//array where % for crypto matches returned ABVs
var roundingArray = []; // for use in rounding when % crypto !== any returned ABVs
var abv;

function pullDaily(){
    
        abv = Math.abs(percents.day); //5.8 is a test, this will eventually be our % change from crypto
        var abvLower = Math.floor(abv); //create range for queryURL
        var abvHigher = Math.ceil(abv);
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
            for (j = 0; j < beerArray.length; j++) {
                console.log(beerResponse[j]); // print results for matching beers
            }
            var testBeer = beerResponse[0];
            console.log(testBeer);
            var beerImage = testBeer.image_url;
            console.log(beerImage);
            var nameRow = $("<div class='row dNameRow result'>");
            var imageRow = $("<div class='row dImageRow result'>");
            var desRow = $("<div class='row dDesRow result'>");
            var nameDiv = $("<div class='dailyNameDiv'>");
            var imageDiv = $("<div class='dailyImageDiv'>");
            var desDiv = $("<div class='dailyDesDiv'>");
            var printABV = testBeer.abv;            
            var popImage = $("<img>", {
                class: "beerIMG",
                id: testBeer.name,
                src: beerImage,
                alt: "a picture of the beer"
            });
            var beerDes = $("<p>").text(testBeer.description);
            var beerName = $("<p>").text(testBeer.name);
                $(".daily_beer").append(nameRow);                
                $(".daily_beer_photo").append(imageRow);
                $(".daily_beer_description").append(desRow);
                $(".dNameRow").append(nameDiv);
                $(".dImageRow").append(imageDiv);
                $(".dDesRow").append(desDiv);
                $(".dailyNameDiv").append(beerName);
                $(".dailyImageDiv").append(popImage);
                $(".dailyDesDiv").append(beerDes);
                $(".dailyNameDiv").append("ABV: " + printABV);
                pullWeekly();
        });
    }

    function pullWeekly(){
        
            abv = Math.abs(percents.week); //5.8 is a test, this will eventually be our % change from crypto
            var abvLower = Math.floor(abv); //create range for queryURL
            var abvHigher = Math.ceil(abv);
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
                for (j = 0; j < beerArray.length; j++) {
                    console.log(beerResponse[j]); // print results for matching beers
                }
                var testBeer = beerResponse[0];
                console.log(testBeer);
                var beerImage = testBeer.image_url;
                console.log(beerImage);
                var nameRow = $("<div class='row wNameRow result'>");
                var imageRow = $("<div class='row wImageRow result'>");
                var desRow = $("<div class='row wDesRow result'>");
                var nameDiv = $("<div class='weeklyNameDiv'>");
                var imageDiv = $("<div class='weeklyImageDiv'>");
                var desDiv = $("<div class='weeklyDesDiv'>");
                var printABV = testBeer.abv;            
                var popImage = $("<img>", {
                    class: "beerIMG",
                    id: testBeer.name,
                    src: beerImage,
                    alt: "a picture of the beer"
                });
                var beerDes = $("<p>").text(testBeer.description);
                var beerName = $("<p>").text(testBeer.name);
                    $(".weekly_beer").append(nameRow);                
                    $(".weekly_beer_photo").append(imageRow);
                    $(".weekly_beer_description").append(desRow);
                    $(".wNameRow").append(nameDiv);
                    $(".wImageRow").append(imageDiv);
                    $(".wDesRow").append(desDiv);
                    $(".weeklyNameDiv").append(beerName);
                    $(".weeklyImageDiv").append(popImage);
                    $(".weeklyDesDiv").append(beerDes);
                    $(".weeklyNameDiv").append("ABV: " + printABV);    
            });
        }
// }//close for loop
// }//close pullBeer()

function odouls() { //function when % is too low
    console.log("odouls");
};

function sixpack() {//function when % is too high
    console.log("sixpack");
};

function emptyDivs(){
    $(".result").empty();
    // $(".daily_beer_photo").empty();
    // $(".daily_beer_description").empty();
    // $(".weekly_beer").empty();
    // $(".weekly_beer_photo").empty();
    // $(".weekly_beer_description").empty();
}

$("#search-currency").on("click", function() {
    // Get value from data attribute
    emptyDivs();
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
    percents.day = percentDay;
    percents.week = percentWeek;
    
    pullDaily();

}





    


