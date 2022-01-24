const http = require("follow-redirects").http;
const fs = require("fs");

const options = {
  method: "POST",
  hostname: "127.0.0.1",
  port: 9467,
  path: "/",
  headers: {
    "Content-Type": "application/json",
  },
  maxRedirects: 0,
  timout: 5000,
};

const req = http.request(options, function (res) {
  let chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    let body = Buffer.concat(chunks);
    console.log("res end :", body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

/* example obj...
const errData = {
  flag_type: 1,
  req_src: "producer-temp-api",
  req_path: "/temperature",
  req_file: "kafkajs_test.js",
  req_line: 18,
  req_func: "createProducer",
  req_type: "Controller",
  req_raw: data,
  content_err: error.message,
  is_solved: 0,
  is_notified: 0,
  is_assgined: "name",
};
*/

function errToPostLogApi(postData) {
  req.write(JSON.stringify(postData));
  req.end();
}

module.exports = {
  errToPostLogApi,
};
