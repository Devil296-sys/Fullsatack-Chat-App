import jwt from "jsonwebtoken"

export const VerifyToken=async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message:"Unauthorized user | No token Provided"})
        const decoded =  jwt.verify(token,process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        console.log("Error from Middlewares",error)
        res.status(500).json({message:"Internal server Error"})
    }
}