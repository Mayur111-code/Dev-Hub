import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true },
    email: { 
        type: String,
        unique: true, 
        required: true },
    password: {
         type: String, 
         required: true },
    skills: { 
        type: [String], 
        default: [] },
    bio: { 
        type: String, 
        default: "" },
    avatar: { 
        type: String,
         default: "" },

    followers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" }],
    following: [{ 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
