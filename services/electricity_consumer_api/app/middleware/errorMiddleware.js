const axios = require('axios');

const errorCatch = async (err,req,res,next) =>{
    console.log(err)
    const data = JSON.stringify(err)

    const config = {
        method: 'post',
        url: 'http://localhost:9467/errlogs',
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
    }
    await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error.message);
        });
}

module.exports = errorCatch
