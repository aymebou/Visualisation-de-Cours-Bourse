/* BACKEND ONLY

This file contains functions designed to create the json of the stocks market prices in order to pass it to the user
for the front end


 */

const Express = require('express');
const router = Express.Router();

var https = require('https');
const BaseJoi = require('joi');
const Celebrate = require('celebrate');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

/*
    requests new data for user, function format :
        - start    : YYYY-MM-DD
        - end      : YYYY-MM-DD
        - stock : stock codename
 */
router.post('/', Celebrate.celebrate({

    //We check if request makes sense so that server doesn't have errors due to meaningless requests
    body: Joi.object().keys({
        start: Joi.date().format("YYY-MM-DD").raw().required(),
        end: Joi.date().format("YYY-MM-DD").raw().required(),
        stock: Joi.any().valid('nsft','amzn','fb','nflx','aapl','tsla'),
        //valid stocks are only amongst these
    })
}), (req,res,err) => {
    //If request makes sense, we proceed to set the interval between points to have a decent number of points.
    var interv = 'daily';

    var dateInterval = new Date((new Date(req.body.end)).getTime() - (new Date(req.body.start)).getTime());
    var dayInterval = ((dateInterval.getUTCFullYear()-1970)*12 + dateInterval.getUTCMonth())*30 + dateInterval.getUTCDay();

    //Check if everything is in order
    if (dayInterval<0) {
        res.send("You have entered wrong time interval");
        return;
    }

    //The request recieved is a JSON in string format, in order for it not to be too long, we change the interval (experimental values)
    if (dayInterval > 150) {
        interv='weekly';
    }
    if (dayInterval>600) {
        interv='monthly';
    }
    if (dayInterval>4500){
        //The JSON in string format does not go through the parser correctly if too long,
        // i.e ~12y is the max we can get, even in monthly values (experimental)
        res.send("Please reduce time interval");
        return;
    }

format(function (a) {
            //resend to client side
            res.send(a);
        }, req.body.stock, req.body.start,req.body.end,interv);
});


/*
    Updates the Json files in public, important to not execute on client side because the auth key would be passed.
    Takes no argument, uses global time settings defined above and updates all stocks at one.
 */

function format(callbackFun, stock, startTime, endTime, interval) {

    var formatedData = [];
    //FormatedData will store the JSON to return
    var options = {
        hostname: 'sandbox.tradier.com',
        path: '/v1/markets/history?symbol='.concat(stock,'&start=',startTime,'&end=',endTime,'&interval=',interval),
        method: 'GET',
        headers: {
            'Authorization': "Bearer ENEMkPQohnmS5Ml2fHMoIYaIGADQ",
            'Accept':' application/json'

        },
    };

    https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            if (chunk !== undefined && chunk.length > 0) {
                //If connection is down on any part, we avoid parsing empty string file
                chunk = JSON.parse(chunk)["history"]["day"]
                for (var i = 0;i<chunk.length;++i) {
                    formatedData.push(
                        {date:chunk[i]["date"],
                            close: chunk[i]["close"],
                        });
                }
                callbackFun(formatedData);

            } else {
                //If error, we return empty array
                callbackFun(new Array());
                return;
            }

        });

    }).end();
}


module.exports.router = router;