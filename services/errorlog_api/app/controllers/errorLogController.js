const { mongo_client }  = require('../adapters/database/mongodb')

exports.addLog = async (req, res) => {
    const db = mongo_client.db('test')
    const log = req.body
    await db.collection('group2').insertOne(log)
        .then(sonuc=>{
            res.status(200).send(sonuc)
            console.log("log kaydedildi")
        }).catch(err=>{
            res.send(err)
        })
}
exports.getLogs = async (req, res) => {
    const db = mongo_client.db('test')
    await db.collection('group2').find().toArray()
        .then(sonuc=>{
            res.status(200).send(sonuc)
            console.log("veriler getirildi")
        }).catch(err=>{
            res.send(err)
        })
}