const {MongoClient} = require('mongodb')
const uri = process.env.MONGOURI
const client = new MongoClient(uri)

async function run() {
    await client.connect()
    await client.db(process.env.MONGODBNAME).command({ ping: 1 }).then(()=>{
        console.log("::> MongoDB Server is Ready")
    }).catch(err=>{
        console.log(err)
    })
}
run().catch(console.dir)

exports.mongo_client = client

/* CREATE COLLECTION EXAMPLE
const db = mongo_client.db('kisi');
db.createCollection('kisiler', (err, result) => {
    if (err) throw err;
    console.log('Koleksiyon oluşturuldu.');
    mongo_client.close();
});*/
