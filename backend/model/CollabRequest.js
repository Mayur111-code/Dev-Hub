import mongoose from "mongoose";

const collabRequestSchema = new mongoose.Schema({
  from: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  to: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Post",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("CollabRequest", collabRequestSchema);
