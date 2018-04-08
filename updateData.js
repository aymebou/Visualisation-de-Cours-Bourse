/*

This file contains a function design to create the json file of the stocks market prices on the public folder in order to pass it to the user
for the front end


 */

const Express = require('express');
const router = Express.Router();

var https = require('https');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var fs = require('fs');
var sleep = require('system-sleep');


/*
    Changes global project time settings, format :
        - start  : YYYY-MM-DD
        - end    : YYYY-MM-DD
        - interv : 'daily', 'weekly', or 'monthly'
 */

router.post('/', (req,res,err) => {

    var interv = 'daily';
    var dateInterval = new Date((new Date(req.body.end)).getTime() - (new Date(req.body.start)).getTime());
    var dayInterval = ((dateInterval.getUTCFullYear()-1970)*12 + dateInterval.getUTCMonth())*30 + dateInterval.getUTCDay();

    if (dayInterval > 150) {
        interv='weekly';
    }
    if (dayInterval>600) {
        interv='monthly';
    }


format(function (a) {
            //renvoyer côté client
            res.send(a);
        }, req.body.currency, req.body.start,req.body.end,interv);
});


/*
    Updates the Json files in public, important to not execute on client side because the auth key would be passed.
    Takes no argument, uses global time settings defined above and updates all stocks at one.
 */

function format(callbackFun, currency, startTime, endTime, interval) {

    var formatedData = [];
    var options = {
        hostname: 'sandbox.tradier.com',
        path: '/v1/markets/history?symbol='.concat(currency,'&start=',startTime,'&end=',endTime,'&interval=',interval),
        method: 'GET',
        headers: {
            'Authorization': "Bearer ENEMkPQohnmS5Ml2fHMoIYaIGADQ",

        },
    };

    https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log(chunk);
            if (chunk !== undefined && chunk.length > 0) {
                parser.parseString(chunk, function (err, result) {
                    if (err || result==null) {
                        console.log(err);
                        callbackFun(new Array());
                        return;
                    }

                    result = result["history"]["day"]
                    for (var i = 0;i<result.length;++i) {
                        formatedData.push(
                            {date:result[i]["date"],
                                close: result[i]["close"],
                            });
                    }
                    callbackFun(formatedData);

                });
            } else {
                callbackFun(new Array());
                return;
            }

        });

    }).end();
}


module.exports.router = router;