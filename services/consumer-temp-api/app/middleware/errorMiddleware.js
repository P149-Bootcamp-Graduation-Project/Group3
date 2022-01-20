const axios = require('axios');

const errorCatch = async (err,req,res,next) =>{
    const data = JSON.stringify({
        "hataKodu": err.hataKodu,
        "hataMetni": err.message
    })
    const config = {
        method: 'post',
        url: 'http://localhost:3031/',
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
    }
    console.log("111")
    await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error.message);
        });
}

module.exports = errorCatch