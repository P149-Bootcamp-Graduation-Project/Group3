// const { createClient } = require('redis');

// // rd_client = createClient({ url: 'redis://'+process.env.REDIS_HOST });
// const rd_client = createClient({ host:'host-redis', port: 6379 });


// rd_client.on('connect', () => console.log('::> Redis Server is Ready'));
// rd_client.on('error', (err) => console.log('<:: Redis Client Error', err));

// (async () => {
//     await rd_client.connect();
// })();



const redis = require('redis');
const rd_client = redis.createClient({ url: 'redis://redis:6379' });

rd_client.on('connect', () => console.log('::> Redis Server is Ready'));
rd_client.on('error', (err) => console.log('<:: Redis Client Error', err));

(async () => {
    await rd_client.connect();
})();

exports.rd_client = rd_client;