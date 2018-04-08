//script to be used by client to force reload with different settings.

function requestUpdate(starttime,endtime,deltatime) {
    $.ajax({
        url: "http://localhost:4000/update",
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