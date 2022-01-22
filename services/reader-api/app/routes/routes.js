const { route } = require("express/lib/application");

 const { usersRegisterGet, usersRegisterPost, usersRegisterDelete, usersRegisterPatch } = require("../controllers/users-register/users-register");
 const { usersLoginGet, usersLoginPost } = require("../controllers/users-login/users-login");
 const {usersLogoutGet,usersLogoutPost,}=require("../controllers/users-logout/users-logout");
 const {usersResetPswGet, usersResetPswPost}=require("../controllers/users-resetpsw/users-resetpsw");

const router = express.Router();

router.route("/users/register")
  .get(usersRegisterGet)
  .post(usersRegisterPost)
  .delete(usersRegisterDelete)
  .patch(usersRegisterPatch);
  
router.route("/users/login").get(usersLoginGet).post(usersLoginPost);
router.route("/users/logout").get(usersLogoutGet).post(usersLogoutPost);
router.route("/users/resetpsw").get(usersResetPswGet).post(usersResetPswPost);



module.exports = {
  router,
};
