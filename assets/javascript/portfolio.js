database.ref("/cryptoList").on("value", function (snapshot) {
    let currencyList = snapshot.val();

    if (currencyList) {
        for (let i = 0; i < 25; i++) {
            let currency = currencyList[i];
            // Create row for data table
            dataTable.row.add([
                `<img src="assets/images/graph.png" class="graph-icon" data-currency="${currency.symbol}" />`,
                currency.symbol,
                currency.name,
                currency.percent_change_1h,
                currency.percent_change_24h,
                currency.percent_change_7d,
                "<button class='btn-sm btn-danger'>Remove</button>"
            ]).draw(false);
        }
    }
});

// Initialize data tables on portfolio
const dataTable = $('#portfolio-table').DataTable({
    "order": [[1, 'asc']],
    "columnDefs": [{
        "targets": 'no-sort',
        "orderable": false,
    }]
});

// Remove functionality for rows in the table
$('#portfolio-table tbody').on('click', 'button.btn-danger', function () {
    // Delete from datatable
    dataTable.row($(this).parents('tr')).remove().draw();
    // TODO delete from firebase
});

// Click event handler for graph icon to show the cryptocompare chart
$(document).on('click', '.graph-icon', function () {
    let symbol = $(this).data("currency");
    // Remove any previous chart
    $("#currency-graph").empty();

    // CryptoCompare graph widget
    let appName = encodeURIComponent(window.location.hostname);
    if (appName === "") {
        appName = "local";
    }
    // anchored to script tag for dynamic loading
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    let theUrl = `https://widgets.cryptocompare.com/serve/v3/coin/chart?fsym=${symbol}&tsyms=USD`;
    s.src = theUrl + (theUrl.indexOf("?") >= 0 ? "&" : "?") + "app=" + appName;
    document.getElementById("currency-graph").appendChild(s);

});

