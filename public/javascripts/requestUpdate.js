//script to be used by client to force reload with different settings.

function requestUpdate(starttime,endtime,deltatime) {
    $.ajax({
        url: "http://52.56.36.139/update",
        data: {
            start: starttime,
            end: endtime,
            delta:deltatime,
        },
        method: "POST",
        dataType: "json",
        error: (request, status, error) => {
            console.log(error);
    },
        succes: (data, status, request) => {
            console.log("data sent");

    }
});
}