database.ref("/cryptoList").on("value", function (snapshot) {
    var currencyList = snapshot.val();

    if (currencyList) {
        for (var i = 0; i < 25; i++) {
            var currency = currencyList[i];
            // Create row for data table
            dataTable.row.add([
                currency.symbol,
                currency.name,
                currency.percent_change_1h,
                currency.percent_change_24h,
                currency.percent_change_7d,
                `<button id="remove_${currency.symbol}"class='btn-sm btn-danger'>Remove</button>`
            ]).draw(false);
        }
    }
});

// Initialize data tables on portfolio
var dataTable = $('#portfolio-table').DataTable();

// Remove functionality for rows in the table
$('#portfolio-table tbody').on('click', 'button.btn-danger', function () {
    // Delete from datatable
    dataTable.row($(this).parents('tr')).remove().draw();
    // TODO delete from firebase
});



