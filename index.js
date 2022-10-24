const apiKey = process.argv[2];
if (!apiKey) {
  console.log("API key required");
  process.exit(1);
}
const https = require("https");
const fs = require('fs');

let url = "https://services.e-st.lv/m2m/get-object-list";

let result = {};
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
        result = JSON.parse(body);

        // flatOList.forEach((o, i)=> {
        //   getConsumption(o,i);
        // })

        getConsumption(result.oList[0], 0, true);


      });
    }
  )
  .on("error", function (e) {
    console.log("Got an error: ", e);
  });
request.end();

function getConsumption(o, i, last) {
  let oEIC = o.oEIC;
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
          result.oList[i].consumption = response;
          if (last) {
            fs.writeFileSync("consumption.json", JSON.stringify(result, undefined, 2));
          }
        });
      }
    )
    .on("error", function (e) {
      console.log("Got an error: ", e);
    });
  request.end();
}

const flattenJSON = (obj = {}, res = {}, extraKey = '') => {
  for (key in obj) {
    if (typeof obj[key] !== 'object') {
      res[extraKey + key] = obj[key];
    } else {
      flattenJSON(obj[key], res, `${extraKey}${key}/`);
    };
  };
  return res;
};