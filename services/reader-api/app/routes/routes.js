const { route } = require("express/lib/application");
const { verifyRefreshToken } = require("../middleware/authentication");

 const { usersRegisterGet, usersRegisterPost, 
        usersRegisterDelete, usersRegisterPatch } = require("../controllers/users-register/users-register");
 const { usersLoginGet, usersLoginPost } = require("../controllers/users-login/users-login");
 const {usersLogoutGet,usersLogoutPost,}=require("../controllers/users-logout/users-logout");
 const {usersResetPswGet, usersResetPswPost}=require("../controllers/users-resetpsw/users-resetpsw");

 const {schoolsGet, schoolsPost, schoolsDelete, schoolsPatch}=require("../controllers/schools/schools");
 const {classesGet, classesPost, classesDelete, classesPatch}=require("../controllers/classes/classes");
 const {sensorsGet, sensorsPost, sensorsDelete, sensorsPatch}=require("../controllers/sensors/sensors");
 const {temperatureGet}=require("../controllers/temperature/temperature");
 const {airGet}=require("../controllers/air/air");
 const {powerGet}=require("../controllers/electricity/electricity");
 const {errlogGet,errlogPatch}=require("../controllers/errlog/errlog");

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

router.route("/schools")
    .get(verifyRefreshToken,schoolsGet)
    .post(verifyRefreshToken, schoolsPost)
    .delete(verifyRefreshToken, schoolsDelete)
    .patch(verifyRefreshToken, schoolsPatch);

router.route("/classes")
    .get(verifyRefreshToken, classesGet)
    .post(verifyRefreshToken, classesPost)
    .delete(verifyRefreshToken, classesDelete)
    .patch(verifyRefreshToken, classesPatch);

router.route("/sensors")
    .get(verifyRefreshToken,sensorsGet)
    .post(verifyRefreshToken, sensorsPost)
    .delete(verifyRefreshToken, sensorsDelete)
    .patch(verifyRefreshToken, sensorsPatch);

router.route("/temperature").get(verifyRefreshToken,temperatureGet);
router.route("/airquality").get(verifyRefreshToken,airGet);
router.route("/electricity").get(verifyRefreshToken,powerGet);

router.route("/errlog")
    .get(verifyRefreshToken,errlogGet)
    .patch(verifyRefreshToken, errlogPatch);


module.exports = {
  router,
};
