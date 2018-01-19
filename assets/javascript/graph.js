    $("#search-currency").on("click", function(){
        var cryptoinput = $("#search-currency").data("curr-symbol");
        baseUrl = "https://widgets.cryptocompare.com/";
        //var scripts = document.getElementsByTagName("script");
        var graphDaily = $(".daily_graph_img");
        var embedderDaily = graphDaily[ graphDaily.length - 1 ];
        var cccTheme = {"General":{"background":"#333","borderColor":"#545454","borderRadius":"4px 4px 0 0"},"Header":{"background":"#000","color":"#FFF"},"Followers":{"background":"#f7931a","color":"#FFF","borderColor":"#e0bd93","counterBorderColor":"#fdab48","counterColor":"#f5d7b2"},"Data":{"priceColor":"#FFF","infoLabelColor":"#CCC","infoValueColor":"#CCC"},"Chart":{"fillColor":"rgba(86,202,158,0.5)","borderColor":"#56ca9e"},"Conversion":{"background":"#000","color":"#999"}};
        (function (){
        var appName = encodeURIComponent(window.location.hostname);
        if(appName==""){appName="local";}
        var sD = document.createElement("script");
        sD.type = "text/javascript";
        sD.async = true;
        var theUrlDaily = baseUrl+'serve/v1/coin/chart?fsym=' + cryptoinput + '&tsym=USD';
        sD.src = theUrlDaily + ( theUrlDaily.indexOf("?") >= 0 ? "&" : "?") + "app=" + appName;
        embedderDaily.parentNode.appendChild(sD);
        
        var graphWeekly = $(".weekly_graph_img");
        var embedderWeekly = graphWeekly[ graphWeekly.length - 1 ];
        var sW = document.createElement("script");
        sW.type = "text/javascript";
        sW.async = true;
        var theUrlWeekly = baseUrl+'serve/v1/coin/chart?fsym=' + cryptoinput + '&tsym=USD&period=1W';
        sW.src = theUrlWeekly + ( theUrlWeekly.indexOf("?") >= 0 ? "&" : "?") + "app=" + appName;
        embedderWeekly.parentNode.appendChild(sW);
        })()});