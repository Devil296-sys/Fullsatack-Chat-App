import express from "express"
import { Login,Register,Logout,user ,UpdateData} from "../Controllers/Auth.controller.js"
import { VerifyToken } from "../Middlewares/VerifyToken.js"
const router =  express.Router()

router.post("/register",Register)
router.post("/login",Login)
router.post("/logout",Logout)

router.post("/update-profile",VerifyToken,UpdateData)


router.get("/user",VerifyToken,user)

export default router