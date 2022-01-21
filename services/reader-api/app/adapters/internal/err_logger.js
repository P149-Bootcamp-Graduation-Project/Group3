const http = require("follow-redirects").http;
const fs = require("fs");

const options = {
  method: "POST",
  hostname: "127.0.0.1",
  port: 3000,
  path: "/home",
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

// const errData={
//   flag_type:1,
//   req_src:'producer-temp-api',
//   req_path:'/',
//   req_file:'app.js',
//   req_line:18,
//   req_func:'',
//   req_type:'Controller',
//   req_raw:'err data',
//   content_err:'err msg',
//   is_solved:0,
//   is_notified:0,
//   is_assgined:'name'
// };

function errToPostLogApi(postData) {
  req.write(JSON.stringify(postData));
  req.end();
}

module.exports = {
  errToPostLogApi,
};
