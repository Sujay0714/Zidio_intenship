import {Router} from 'express';

import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";
import { isAuthanticated, login, logout, register,  resendOtp, resetPassword, sendResetPassword, sendVerifyOTP, verifyEmail, activateUserProfile, deleteUserProfile, getNotificationsList, getTeamList, getUserData, markNotificationRead, registerUserTask, updateUserProfile } from '../controllers/auth.controller.js';

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post("/registerusertask", registerUserTask);
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/send-verify-otp', sendVerifyOTP)
authRouter.post('/resend-otp', resendOtp)
authRouter.post('/verify-email', verifyEmail)
authRouter.get('/isauthanticated', isAuthanticated)
authRouter.post('/send-reset-password-otp', sendResetPassword)
authRouter.post('/forget-password', resetPassword)



// 

authRouter.get('/data', getUserData)
authRouter.get("/get-team", protectRoute, isAdminRoute, getTeamList);
authRouter.get("/notifications", protectRoute, getNotificationsList);
authRouter.put("/profile", protectRoute, updateUserProfile);
authRouter.put("/read-noti", protectRoute, markNotificationRead);

authRouter
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);


export default authRouter