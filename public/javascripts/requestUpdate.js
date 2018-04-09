//script to be used by client to force reload with different settings.
var currency;
var starttime;
var endtime;

function setCurrency(curr) {
    currency=curr;
    requestUpdate()
}

function setStartTime(time) {
    starttime=time;
    requestUpdate()
}
function setEndTime(time) {
    endtime=time;
    requestUpdate()
}

function initDates(){
    starttime='2018-01-01';
    endtime='2018-04-01';
    $('#startDate').val('2018-01-01');
    $('#endDate').val('2018-04-01');

}

function initCurrency(){
    currency='amzn';
}

function requestUpdate() {
    $.ajax({
        url: "/update",
        data: {
            start: starttime,
            end: endtime,
            currency:currency,
        },
        method: "POST",
        dataType: "json",
        error: (request, status, error) => {
            console.log(error);
    },
        success: function (data) {

            updateData(data);

    }
});
}