import mongoose from "mongoose"


export const ConnectDb=async()=>{
    try {
        const res= await mongoose.connect(process.env.MONGO_URI)
        if(res){
            console.log("Connected To MongoDb:",res.connection.host)
        }
    } catch (error) {
        console.log(error,":Error from Connection Database")
    }
}