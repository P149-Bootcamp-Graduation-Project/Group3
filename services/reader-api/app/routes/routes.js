const { route } = require("express/lib/application");
const { verifyRefreshToken } = require("../middleware/authentication");

 const { usersRegisterGet, usersRegisterPost, 
        usersRegisterDelete, usersRegisterPatch } = require("../controllers/users-register/users-register");
 const { usersLoginGet, usersLoginPost } = require("../controllers/users-login/users-login");
 const {usersLogoutGet,usersLogoutPost,}=require("../controllers/users-logout/users-logout");
 const {usersResetPswGet, usersResetPswPost}=require("../controllers/users-resetpsw/users-resetpsw");

 const {schoolsGet, schoolsPost}=require("../controllers/schools/schools");

const router = express.Router();

/* users routes */
router.route("/users/register")
  .get(verifyRefreshToken, usersRegisterGet)  //If the middleware validates, it sends all users in response.
  .post(usersRegisterPost)                    // if not exist user then user register and send response with jwt token.
  .delete(verifyRefreshToken, usersRegisterDelete) // If the middleware validates, it delete user.
  .patch(verifyRefreshToken, usersRegisterPatch); // If the middleware validates, it update user.
  
router.route("/users/login")
  .get(usersLoginGet)
  .post(usersLoginPost);

router.route("/users/logout")
    .get(usersLogoutGet)
    .post(verifyRefreshToken, usersLogoutPost); // middleware is delete the redis jwt token key at logout.

router.route("/users/resetpsw").get(usersResetPswGet).post(usersResetPswPost);

/*schools routes */

router.route("/schools")
    .get(verifyRefreshToken,schoolsGet)
    .post(schoolsPost);




module.exports = {
  router,
};
