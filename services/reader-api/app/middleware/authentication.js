const jwt = require("jsonwebtoken");
const {
    rd_client
} = require("../adapters/database/redis");

// function signAccessToken(data) {
//   return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1h' });
// }

function signAccessToken(userId,obj_data) {
    const payload = obj_data;
    const secret = process.env.TOKEN_SECRET;
    const options = {
        expiresIn: "1h",
        audience: userId,
    };
    const token = jwt.sign(payload, secret, options);

    return token;
}

async function signRefreshToken(userId, obj_data) {
    const payload = obj_data;
    const secret = process.env.TOKEN_SECRET;
    const options = {
        expiresIn: "1h",
        audience: userId,
    };

    const refreshToken = jwt.sign(payload, secret, options);

    await rd_client.SET(
        userId.toString(),
        JSON.stringify({
            token: refreshToken,
        }),
        "EX",
        365 * 24 * 60 * 60,
        (err, reply) => {
            if (err) {
                console.log("rd_client.SET err:", err.message);
            }
        },
    );

    return refreshToken;
}

function verifyAccessToken(req, res, next) {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
            return next(createError.Unauthorized(message));
        }
        req.payload= payload;  // token data to body
        next();
    });
}

function verifyRefreshToken(req, res, next) {

    const { refreshToken } = req.body;

    console.log(refreshToken);

    if (!refreshToken){
       return  res.send({message:"user token not found ..."});
        
    } 

    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err, payload) => {
        let userId;

        if (err){
            res.satatus(403).send({message:"user token not found ..."}); //forbidden
            res.end();
         
        } 
        else {
            userId = payload.aud;
            console.log("aud :", userId);

            req.payload=payload;
            req.userId=userId;
            next();

        }
    });
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};