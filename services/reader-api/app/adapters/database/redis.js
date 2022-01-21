// const client = redis.createClient({
//     host: '<hostname>',
//     port: <port>,
//     password: '<password>'
// });
//client.select(3, function() { console.log('select redis db 3'); });

const redis = require("redis");

//const rd_client = redis.createClient({ url:'redis://redis:6379' }); //docker

const rd_client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

rd_client.on("connect", () => {
  console.log("::> Redis Server is Ready");
  rd_client.select(2, function() { console.log('Select redis db index 2 ...'); }); //

});

rd_client.on("error", (err) => console.log("<:: Redis Client Error", err));

(async () => {
  await rd_client.connect();
})();

exports.rd_client = rd_client;
