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
const BaseJoi = require('joi');
const Celebrate = require('celebrate');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

/*
    Changes global project time settings, format :
        - start    : YYYY-MM-DD
        - end      : YYYY-MM-DD
        - interv   : 'daily', 'weekly', or 'monthly'
        - currency : not really currency but stock codename
 */
router.post('/', Celebrate.celebrate({

    //Joi is a plugin here to make sure that the input data is in correct state, managing errors without trouble.
    //Celebrate is just an interface used for Joi

    body: Joi.object().keys({
        start: Joi.date().format("YYY-MM-DD").raw().required(),
        end: Joi.date().format("YYY-MM-DD").raw().required(),
        currency: Joi.string().required(),
    })
}), (req,res,err) => {

    var interv = 'daily';
    var dateInterval = new Date((new Date(req.body.end)).getTime() - (new Date(req.body.start)).getTime());
    var dayInterval = ((dateInterval.getUTCFullYear()-1970)*12 + dateInterval.getUTCMonth())*30 + dateInterval.getUTCDay();

    if (dayInterval > 150) {
        interv='weekly';
    }
    if (dayInterval>600) {
        interv='monthly';
    }
    if (dayInterval>4500){
        res.send([]);
        return;
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
            'Accept':' application/json'

        },
    };
    console.log(options);
    https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log(chunk.length)
            if (chunk !== undefined && chunk.length > 16) {
                chunk = JSON.parse(chunk)["history"]["day"]
                for (var i = 0;i<chunk.length;++i) {
                    formatedData.push(
                        {date:chunk[i]["date"],
                            close: chunk[i]["close"],
                        });
                }
                callbackFun(formatedData);

            } else {
                callbackFun(new Array());
                return;
            }

        });

    }).end();
}


module.exports.router = router;