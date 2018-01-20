


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
var loginRef = database.ref('/login');
var userRef = database.ref('/users');

// Create variable to access google authentication
var provider =  new firebase.auth.GoogleAuthProvider();
// var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

// USER AUTHENTICATION
var btnLogin = $('.btnLogin');
var btnSignout = $('.btnSignout');

loginRef.on('value', function(snapshot) {
    console.log('loginRef firing');
    if (snapshot.val()=='loggedIn') {
        $('.btnSignout').removeClass('d-none');
        $('.btnLogin').addClass('d-none');
    } else if (snapshot.val() == 'loggedOut') {
        $('.btnSignout').addClass('d-none');
        $('.btnLogin').removeClass('d-none');
    };
});

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        firebaseUser.providerData.forEach(function (profile) {
            name = profile.displayName;
            email = profile.email;
            photoURL = profile.photoURL;
            emailVerified = profile.emailVerified;
            uid = profile.uid;
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + uid);
            console.log("  Name: " + name);
            console.log("  Email: " + email);
            console.log("  Photo URL: " + photoURL);
          });
        userRef.push(uid);
    } else {
        console.log('not logged in');
    };
});

btnLogin.on('click', function(e){
    e.preventDefault();
    loginRef.set('loggedIn');
    // Sign In
    firebase.auth().signInWithRedirect(provider).then(function(result) {
        console.log('Successfully signed in');
        var token = result.credential.accessToken;
    }).catch(function(e) {
        console.log(e.message)
    });
});

btnSignout.on('click', function(e){
    e.preventDefault();
    loginRef.set('loggedOut');
    // Sign Out
    firebase.auth().signOut().then(function() {
        console.log('Successfully signed out');
        $('.btnSignout').addClass('d-none');
        $('.btnLogin').removeClass('d-none');
    }).catch(function(e) {
        console.log(e.message)
    });
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
        $(".results-area").css("display", "block");
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
            var nameDiv = $("<div class='dailyNameDiv mx-auto'>");
            var imageDiv = $("<div class='dailyImageDiv mx-auto'>");
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
                $(".dailyNameDiv").append("Name: " + testBeer.name + "<br>");
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
                var nameDiv = $("<div class='weeklyNameDiv mx-auto'>");
                var imageDiv = $("<div class='weeklyImageDiv mx-auto'>");
                var desDiv = $("<div class='weeklyDesDiv'>");
                var printABV = testBeer.abv;            
                var popImage = $("<img>", {
                    class: "beerIMG",
                    id: testBeer.name,
                    src: beerImage,
                    alt: `A picture of ${testBeer.name}`
                });
                var beerDes = $("<p>").text(testBeer.description);
                var beerName = $("<p>").text(testBeer.name);
                    $(".weekly_beer").append(nameRow);                
                    $(".weekly_beer_photo").append(imageRow);
                    $(".weekly_beer_description").append(desRow);
                    $(".wNameRow").append(nameDiv);
                    $(".wImageRow").append(imageDiv);
                    $(".wDesRow").append(desDiv);
                    $(".weeklyNameDiv").append("Name: " + testBeer.name + "<br>");
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
    $(".result").remove();
     }
   

$("#search-currency").on("click", function() {
    // Get value from data attribute
    emptyDivs();
    $("#currency-input").val("");
    let currId = $(this).attr("data-curr-id");
    let cryptoSym = $(this).attr("data-curr-symbol");
    console.log(cryptoSym);

    widget(cryptoSym);
    cryptoHeader(currId);

    if(currId) {
        pullCryptoSingleCurrency(currId, setCurrencyStatsOnUI);
    }
});

function setCurrencyStatsOnUI(data) {
    // format from API
    let currencyData = data[0];

    let price = currencyData.price_usd;
    let percentHour = currencyData.percent_change_1h;
    let percentDay = currencyData.percent_change_24h;
    let percentWeek = currencyData.percent_change_7d;

    console.log("price: " + price);
    console.log("hour:" + percentHour);
    console.log("day:" + percentDay);
    console.log("week:" + percentWeek);
    percents.day = percentDay;
    percents.week = percentWeek;
    
    pullDaily();

    $(".percentDaily").html(" ");
    $(".percentWeekly").html(" ");

    $(".daily_percentage").append('<div class="percentDaily">'+percentDay+'%<div>');
    $(".weekly_percentage").append('<div class="percentWeekly">'+percentWeek+'%<div>');
}




    


