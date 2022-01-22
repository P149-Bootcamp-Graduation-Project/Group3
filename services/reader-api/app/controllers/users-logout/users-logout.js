const { rd_client } = require("../../adapters/database/redis");
const { verifyRefreshToken } = require("../../middleware/authentication");


const usersLogoutGet = (req, res) => {
  res.send("method get from /users/logout index ...");
};

const usersLogoutPost = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    console.log(refreshToken);

    if (!refreshToken) throw createError.BadRequest();

    const userId = await verifyRefreshToken(refreshToken);

    console.log(userId);
    
    rd_client.DEL(userId, (err, val) => {
      if (err) {
        console.log(err.message);
        throw createError.InternalServerError();
      }
      console.log(val);
      res.sendStatus(204).send({message: 'User logout'});
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  usersLogoutGet,
  usersLogoutPost,
};
