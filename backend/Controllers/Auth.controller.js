import { User } from "../Models/UserModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import cloudinary from "../libs/Cloudinary.js";
export const Register=async(req,res)=>{
    const {fullName,email,password} = req.body;
    if(!fullName || !email || !password) return res.status(400).json({message:"All fields are required"})
    try {
        const Existeduser = await User.findOne({email})
        if(Existeduser) return res.status(400).json({message:"The Account with this email is already existed"})
        const HashedPassword = await bcrypt.hash(password,10)
        const newuser = new User({
            fullName,
            email,
            password:HashedPassword
        })
        await newuser.save()
        const token= jwt.sign(
            {userId: newuser._id,
                fullName: newuser.fullName,
                email: newuser.email,
                profileSetup: newuser.profileSetup,
                profilePic: newuser.profilePic,
                bio: newuser.bio,
                friends: newuser.friends,
                sentRequests:newuser.sentRequests
        },
        process.env.SECRET_KEY,{expiresIn:"7d"})
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json(newuser)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server Error"})
    }
}
export const Login=async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password) return res.status(400).json({message:"All fields are required"})
    try {
        const Existeduser = await User.findOne({email})
        if(!Existeduser) return res.status(400).json({message:"Invalid Credentials"})
        const ComparePassword = await bcrypt.compare(password,Existeduser.password)
        if(!ComparePassword) return res.status(400).json({message:"Invalid Credentials"})

        const token= jwt.sign(
            {
                userId: Existeduser._id,
                fullName: Existeduser.fullName,
                email: Existeduser.email,
                profileSetup: Existeduser.profileSetup,
                profilePic: Existeduser.profilePic,
                bio: Existeduser.bio,
                friends: Existeduser.friends,
                sentRequests:Existeduser.sentRequests
        },
        process.env.SECRET_KEY,{expiresIn:"7d"})
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(Existeduser)
    } catch (error) {
        console.log("Error from authController Login",error)
        res.status(500).json({message:"Internal server Error"})
    }
}
export const Logout=async(req,res)=>{
    try {
        res.clearCookie("jwt",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
        })
        return res.status(200).json({message:"Successfully Logged Out"})
    } catch (error) {
        console.log("Error from Logout Routes in Auth Controller")
        res.status(500).json({message:"Internal server Error"})
    }
}
export const user=async(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server Error"})
    }
}
export const UpdateData = async (req, res) => {
    const { profilePic, bio } = req.body;
    const LoggedInUserId = req.user.userId;
  
    if (!bio) return res.status(400).json({ message: "Bio is required" });
    if (!profilePic) return res.status(400).json({ message: "Profile Pic is required" });

    try {
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
      const updatedUser = await User.findByIdAndUpdate(
        LoggedInUserId,
        {
          bio,
          profilePic:uploadResponse.secure_url,
          profileSetup: true,
        },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const token = jwt.sign(
        {
          userId: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          profileSetup: updatedUser.profileSetup,
          profilePic: updatedUser.profilePic,
          bio: updatedUser.bio,
          friends: updatedUser.friends,
        },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("Error in UpdateData:", error);
      res.status(500).json({ message: "Internal server error" });
    }};