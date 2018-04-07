/*

This file contains a function design to create the json file of the stocks market prices on the public folder in order to pass it to the user
for the front end


 */



var https = require('https');
xml2js = require('xml2js');
var parser = new xml2js.Parser();
var fs = require('fs');

var startTime='2018-01-01';
var endTime = '2018-04-01';
var interval='daily';

/*
    Changes global project time settings, format :
        - start  : YYYY-MM-DD
        - end    : YYYY-MM-DD
        - interv : 'daily', 'weekly', or 'monthly'
 */
function setTimers(start,end,interv) {
    startTime=start;
    endTime=end;
    interval=interv;
}

/*
    Updates the Json files in public, important to not execute on client side because the auth key would be passed.
    Takes no argument, uses global time settings defined above and updates all stocks at one.
 */
function update() {



    function format(currency) {
        console.log("Updating ".concat(currency));

        var formatedData = [];
        const options = {
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
                parser.parseString(chunk, function (err, result) {
                    result = result["history"]["day"]
                    //console.log(JSON.stringify(result));
                    for (var i = 0;i<result.length;++i) {
                        formatedData.push(
                            {date:result[i]["date"],
                                close: result[i]["close"],
                            });
                    }
                    fs.open('./public/'.concat(currency, '.json'),'w', (err,fd) => {

                        fs.writeFile(fd, JSON.stringify(formatedData), function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });

                });

            });
        }).end();
    }

    format('amzn');
    format('msft');
    format('fb');
    format('tsla');
    format('nflx');
    format('aapl');




}

module.exports.update = update;