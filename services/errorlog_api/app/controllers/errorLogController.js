const { mongo_client }  = require('../adapters/database/mongodb')

exports.addLog = async (req, res) => {
    const db = mongo_client.db('group2')
    const log = req.body
    await db.collection('errorLog').insertOne(log)
        .then(sonuc=>{
            res.status(200).send(sonuc)
            console.log("başarılı")
        }).catch(err=>{
            res.send(err)
        })
}