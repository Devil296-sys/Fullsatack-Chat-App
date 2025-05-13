import express from "express"
import {VerifyToken} from "../Middlewares/VerifyToken.js"
import { Users,sendRequest,getFriendRequests,AcceptFriendRequest,FriendSidebar,SendMessage ,ReceiveMessages,ClearChats} from "../Controllers/Messages.controller.js"
const router =  express.Router()


router.get("/users",VerifyToken,Users)

router.post("/send-request", VerifyToken, sendRequest);
router.get("/friend-requests", VerifyToken, getFriendRequests);
router.post("/accept-request", VerifyToken, AcceptFriendRequest);
router.get("/friends",VerifyToken,FriendSidebar)


router.post("/send-messages",VerifyToken,SendMessage)
router.post("/delete-messages",VerifyToken,ClearChats)
router.get("/receive-messages/:receiverId",VerifyToken,ReceiveMessages)

export default router