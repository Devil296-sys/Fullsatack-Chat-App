import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileSetup: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
        default:""
    },
    bio: {
        type: String,
        default:""
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
    ,  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // incoming
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // outgoing
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
