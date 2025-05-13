import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "../Routes/auth.routes.js";
import messagesRoutes from "../Routes/messages.routes.js";
import { ConnectDb } from "../libs/db.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
const app = express();
import path from "path";
const __dirname =  path.resolve()
dotenv.config();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    credentials: true,
  },
});
export function getReceiverSocketId (userId){
  return userSocketMap[userId]
}

const userSocketMap= {}
io.on("connection", (socket) => {
  // console.log("New socket connection:", socket.id);
  const userId = socket.handshake.query.userId
  if(userId) userSocketMap[userId] =socket.id
  io.emit("getOnlineUsers",Object.keys(userSocketMap))
  socket.on("disconnect",()=>{
    // console.log("A user is Disconneceted:",socket.id)
    delete userSocketMap[userId]
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
  })
});

if(process.env.NODE_ENV==="production")
{
  app.use(express.static(path.join(__dirname,"../client/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client","dist","index.html"))
  })
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);
server.listen(5000, () => {
  ConnectDb();
  console.log("Server running on port 5000");
});
