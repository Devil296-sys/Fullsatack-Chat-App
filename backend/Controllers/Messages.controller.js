import {Message}  from "../Models/MessageModel.js"
import { User } from "../Models/UserModel.js";
import { getReceiverSocketId, io } from "../src/index.js";
export const Users = async (req, res) => {
  const LoggedInUser = req.user.userId;

  try {
    const currentUser = await User.findById(LoggedInUser).select("friends");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const users = await User.find({
      _id: { $nin: [LoggedInUser, ...currentUser.friends] },
    }).select("-password");

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error from Fetching Users in Message Routes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const sendRequest = async (req, res) => {
  const senderId = req.user.userId;
  const { receiverId } = req.body;

  try {
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You can't send a request to yourself." });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (receiver.requests.includes(senderId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { requests: senderId }
    });

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { sentRequests: receiverId }
    });

    return res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Send Request Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFriendRequests = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId)
      .populate("requests", "fullName email profilePic createdAt")
      .select("requests");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ requests: user.requests });
  } catch (error) {
    console.error("Get Friend Requests Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const AcceptFriendRequest = async (req, res) => {
  const userId = req.user.userId;
  const { senderId } = req.body;

  try {
    if (userId === senderId) {
      return res.status(400).json({ message: "You can't accept your own request." });
    }

    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    if (!user || !sender) {
      return res.status(404).json({ message: "User not found" });
    }
    if (sender.friends.includes(user)) {
      return res.status(400).json({ message: "You are already friends." });
    }

    if (!user.requests.includes(senderId)) {
      return res.status(400).json({ message: "No friend request from this user" });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: senderId },
      $pull: { requests: senderId }
    });

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friends: userId },
      $pull: { sentRequests: userId }
    });

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Accept Friend Request Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const FriendSidebar = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId)
      .populate("friends", "fullName email profilePic createdAt")
      .select("friends");

    return res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.error("Friend Sidebar Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const SendMessage = async(req,res)=>{
  const userId = req.user.userId
  const {text,receiverId} = req.body
  if(!text ) return res.status(400).json({message:"You can't send Empty Messages"})
  try {
    const Messages  =  await Message.create({
      sender:userId,
      receiver:receiverId,
      text,
      
    })
    const receiverSocketId  =  getReceiverSocketId(receiverId)
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage",Messages)
    }
    res.status(200).json(Messages)
  } catch (error) {
    console.error("Cant't send message:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const ReceiveMessages =async (req,res)=>{
  const {receiverId} =req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, receiver: receiverId },
        { sender: receiverId, receiver: req.user.userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

export const ClearChats = async(req,res)=>{
  const userId = req.user.userId
  const {receiverId } =req.body
  try {
    await Message.deleteMany({
      $or:[
        {sender:userId,receiver:receiverId},
        {sender:receiverId,receiver:userId}
      ]
    }) ;
    res.status(200).json({ message: "Chat history cleared successfully" });
  } catch (error) {
    console.error("Error in Clearing chat:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

