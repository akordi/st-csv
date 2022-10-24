const http = require("http");
const https = require("https");
let url = "https://services.e-st.lv/m2m/get-object-list";
const apiKey = process.env.API_KEY; 
fs = require('fs');


var request = https
  .get(
    url,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    },
    function (res) {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", function (chunk) {
        body += chunk;
      });

      res.on("end", function () {
        var response = JSON.parse(body);
        console.log(response);
        //getConsumption();
      });
    }
  )
  .on("error", function (e) {
    console.log("Got an error: ", e);
  });
request.end();

function getConsumption(oEIC) {
  url = `https://services.e-st.lv/m2m/get-object-consumption?oEIC=${oEIC}&dF=2022-09-01T00:00:00.000Z&dT=2022-10-01T00:00:00.000Z`;

  var request = https
    .get(
      url,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
      function (res) {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", function (chunk) {
          body += chunk;
        });

        res.on("end", function () {
          var response = JSON.parse(body);
          console.log(response);

          let result = [];
          let stringResult = ''
          response.forEach((meteringPoint) => {
            let meteringPointData = { MpNr: meteringPoint.mpNr };
            meteringPoint.mList.forEach((meter) => {
              meter.cList.forEach((meterMeasurement) => {
                stringResult +=`${meteringPoint.mpNr};${meter.mNr};${meterMeasurement.cDt};${meterMeasurement.cVR};${meterMeasurement.cVV}\n`
              });
            });
          });

          fs.writeFile('consumption.csv', stringResult, function (err) {
            if (err) return console.log(err);
            console.log('Hello World > helloworld.txt');
          });

          console.log(JSON.stringify(result));
        });
      }
    )
    .on("error", function (e) {
      console.log("Got an error: ", e);
    });
  request.end();
}
