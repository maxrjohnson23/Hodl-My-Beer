//global var
//firebase

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