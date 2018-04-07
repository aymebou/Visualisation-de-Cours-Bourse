var update = require("../updateData.js").update;

//script to be used by client to force reload with different settings.

function requestUpdate(starttime,endtime,deltatime) {
    update(starttime, endtime, deltatime);
}