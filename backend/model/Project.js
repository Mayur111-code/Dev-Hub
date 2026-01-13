import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: { type: String, required: true },
  description: { type: String, required: true },

  techStack: { type: [String], default: [] },   // ⭐ NEW
  rolesRequired: { type: [String], default: [] },  // ⭐ NEW

  image: { type: String, default: "" },

  // team members
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
   teamSize: { type: Number, required: true },

  // ⭐ REQUEST LIST (Pending Requests)
  requests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String,
      status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
    }
  ],

  // project status
  status: {
    type: String,
    enum: ["open", "in-progress", "completed"],
    default: "open"
  }

}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
