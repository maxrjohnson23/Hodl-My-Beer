


// Initialize Firebase
var config = {
    apiKey: "AIzaSyD7p-vvXrxOOb8X_0MJiVekPqAVUKW4p70",
    authDomain: "hodl-my-beer.firebaseapp.com",
    databaseURL: "https://hodl-my-beer.firebaseio.com",
    projectId: "hodl-my-beer",
    storageBucket: "hodl-my-beer.appspot.com",
    messagingSenderId: "946695384034"
};
// firebase.initializeApp(config);

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}
// Create a variable to reference the database.
var database = firebase.database();
var userRef = database.ref('/users');

var getLogin = sessionStorage.getItem('Login');
var getSignout = sessionStorage.getItem('Signout');


// var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

// USER AUTHENTICATION

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        firebaseUser.providerData.forEach(function (profile) {
            name = profile.displayName;
            email = profile.email;
            photoURL = profile.photoURL;
            emailVerified = profile.emailVerified;
            uid = profile.uid;
        });
        writeUserData(uid, name, email, photoURL);
        $('.userPhoto').html(`<img src="${photoURL}" class="nav-link rounded-circle" style="max-width: 75px">`);
        $('.userName').text(name);
        sessionStorage.setItem('Login', '<button class="btn navbar-btn text-white btn-secondary btnLogin m-auto d-none" type="submit">Log in</button>');
        sessionStorage.setItem('Signout', '<button class="btn navbar-btn text-white btn-secondary btnSignout m-auto" type="submit">Sign out</button>');
        // Set user id in session for later data updates
        sessionStorage.setItem('userId', uid);
        $('.logincontainer').html(sessionStorage.getItem('Login'));
        $('.signoutcontainer').html(sessionStorage.getItem('Signout'));
    } else {
        console.log('User not logged in');
    };
});

function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
};


$('.container').on('click', 'button.btnLogin', function (e) {
    e.preventDefault();
    // Create variable to access google authentication
    var provider = new firebase.auth.GoogleAuthProvider();
    // Sign In
    sessionStorage.setItem('Login', '<button class="btn navbar-btn text-white btn-secondary btnLogin m-auto d-none" type="submit">Log in</button>');
    sessionStorage.setItem('Signout', '<button class="btn navbar-btn text-white btn-secondary btnSignout m-auto" type="submit">Sign out</button>');
    $('.logincontainer').html(sessionStorage.getItem('Login'));
    $('.signoutcontainer').html(sessionStorage.getItem('Signout'));
    firebase.auth().signInWithRedirect(provider).then(function (result) {
        console.log('Successfully signed in');
        var token = result.credential.accessToken;
        var user = result.user;
    }).catch(function (e) {
        console.log(e.message)
    });
});


$('.container').on('click', 'button.btnSignout', function (e) {
    e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    // Sign Out
    sessionStorage.setItem('Login', '<button class="btn navbar-btn text-white btn-secondary btnLogin m-auto" type="submit">Log in</button>');
    sessionStorage.setItem('Signout', '<button class="btn navbar-btn text-white btn-secondary btnSignout m-auto d-none" type="submit">Sign out</button>');
    $('.logincontainer').html(sessionStorage.getItem('Login'));
    $('.signoutcontainer').html(sessionStorage.getItem('Signout'));
    firebase.auth().signOut().then(function () {
        console.log('Successfully signed out');
        sessionStorage.clear();
        $('.userPhoto').empty();
        $('.userName').empty();
    }).catch(function (e) {
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

function pullDaily() {
    $(".daily_div").css("display", "block");
    $(".weekly_div").css("display", "block");
    var change = Math.abs(percents.day);
    if (change >= 1 && change <= 2) {
        abv = 0.5;
    } else if (change >= 18 && change <= 20) {
        abv = 3.5;
        sixpack(abv);
    } else if (change > 20 && change <= 24) {
        abv = 4.5;
        sixpack(abv);
    } else if (change > 24 && change <= 30) {
        abv = 5.5;
        sixpack(abv);
    } else if (change > 30) {
        abv = 6.5;
        sixpack(abv);
    } else {
        abv = change; //5.8 is a test, this will eventually be our % change from crypto

    }
    var abvLower = Math.floor(abv); //create range for queryURL
    var abvHigher = Math.ceil(abv);
    var queryURL = "https://api.punkapi.com/v2/beers?abv_gt=" + abvLower + "&abv_lt=" + abvHigher;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (beerResponse) {
        for (let i = 0; i < beerResponse.length; i++) {
            var returnABV = beerResponse[i].abv;
            filterResult.push(returnABV); //collecting all returned ABVs
            if (returnABV === abv) { //where returned ABV matches % from crypto
                beerArray.push(i);  //add to beerArray
            }
        }

        var testBeer = beerResponse[0];
        var beerImage = testBeer.image_url;
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

function pullWeekly() {
    var change = Math.abs(percents.week);
    if (change >= 1 && change <= 2) {
        abv = 0.5;
    } else if (change >= 18 && change <= 20) {
        abv = 3.5;
        sixpack(abv);
    } else if (change > 20 && change <= 24) {
        abv = 4.5;
        sixpack(abv);
    } else if (change > 24 && change <= 30) {
        abv = 5.5;
        sixpack(abv);
    } else if (change > 30) {
        abv = 6.5;
        sixpack(abv);
    }
    else {
        abv = change; //5.8 is a test, this will eventually be our % change from crypto

    }
    // abv = Math.abs(percents.week); //5.8 is a test, this will eventually be our % change from crypto
    var abvLower = Math.floor(abv); //create range for queryURL
    var abvHigher = Math.ceil(abv);
    var queryURL = "https://api.punkapi.com/v2/beers?abv_gt=" + abvLower + "&abv_lt=" + abvHigher;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (beerResponse) {

        for (let i = 0; i < beerResponse.length; i++) {
            var returnABV = beerResponse[i].abv;
            filterResult.push(returnABV); //collecting all returned ABVs
            if (returnABV === abv) { //where returned ABV matches % from crypto
                beerArray.push(i);  //add to beerArray
            }
        }

        var testBeer = beerResponse[0];
        var beerImage = testBeer.image_url;
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

function dailySixPack() {//function when % is too high
    if (percents.day > 18) {
        var sixer = $("<h4 class='sixer'>").text("Congrats, you've earned a six pack!");
        $(".daily_div").prepend(sixer);

    } else if (percents.day < -18) {
        var sixer = $("<h4 class='sixer'>").text("Sorry, you've earned a six pack!");
        $(".daily_div").prepend(sixer);
    }
};

function weeklySixPack() {//function when % is too high
    if (percents.week > 18) {
        var sixer = $("<h4 class='sixer'>").text("Congrats, you've earned a six pack!");
        $(".weekly_div").prepend(sixer);

    } else if (percents.week < -18) {
        var sixer = $("<h4 class='sixer'>").text("Sorry, you've earned a six pack!");
        $(".weekly_div").prepend(sixer);
    }
};

function emptyDivs() {
    $(".result").remove();
    $(".sixer").remove();
}

$("#search-currency").on("click", function () {
    // Get value from data attribute
    emptyDivs();
    $("#currency-input").val("");
    let currId = $(this).attr("data-curr-id");
    let cryptoSym = $(this).attr("data-curr-symbol");

    widget(cryptoSym);
    cryptoHeader(currId);

    if (currId) {
        pullCryptoSingleCurrency(currId, setCurrencyStatsOnUI);
    }
});

function setCurrencyStatsOnUI(data) {
    // format from API
    let currencyData = data[0];

    let percentDay = currencyData.percent_change_24h;
    let percentWeek = currencyData.percent_change_7d;

    percents.day = percentDay;
    percents.week = percentWeek;


    $(".percentDaily").html(" ");
    $(".percentWeekly").html(" ");

    $(".daily_percentage").append('<div class="percentDaily">' + percentDay + '%<div>');
    $(".weekly_percentage").append('<div class="percentWeekly">' + percentWeek + '%<div>');
    pullDaily();
}







