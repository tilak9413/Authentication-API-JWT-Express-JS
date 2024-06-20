import express from "express";
import usercontroller from "../controllers/usercontroller.js";
import checkUserAuth from "../middleware/auth-middleware.js";

const routes = express.Router();
routes.use("/changepassword", checkUserAuth);
routes.use("/profile", checkUserAuth);

routes.post("/register", usercontroller.userRegistration);
routes.post("/login", usercontroller.userloginregister);
routes.post("/changepassword", usercontroller.userlogin);
routes.post("/send-reset-password-email",usercontroller.sendUserPasswordResetEmail);
routes.post('/reset-password/:id/:token', usercontroller.userPasswordReset)
routes.get("/profile", usercontroller.loginuserprofile);
export default routes;
