const { rd_client } = require("../../adapters/database/redis");

const usersLogoutGet = async (req, res) => {
  res.send("method get from /users/logout index ...");
};

const usersLogoutPost = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    let userId = req.userId;
    console.log("req.userId: ", userId);

    await rd_client.GET(userId.toString())
      .then(async (redis_res) => {
        console.log(redis_res);

        let rd_token = JSON.parse(redis_res);

        if (rd_token.token!=null && rd_token.token == refreshToken) {
          console.log("redis res :", rd_token.token, refreshToken);

          await rd_client.DEL(userId.toString())
            .then((res_del) => {
              console.log("res_del :",res_del);
              res.send({message: 'User logout'});
              res.end();
            })
            .catch((err) => {
              console.log(err.message);

            });
        }
      })
      .catch((err) => {
        console.log(err);
         res.send("user not found");
         res.end();
      });

  } catch (error) {
    console.log(error);
    res.send("user not found");
  }
};

module.exports = {
  usersLogoutGet,
  usersLogoutPost,
};
