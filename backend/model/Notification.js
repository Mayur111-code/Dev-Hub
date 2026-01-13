import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "follow",
        "collab_request",
        "collab_accepted",
        "removed_from_project",
      ],
      required: true,
    },

    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true, // ⭐ REQUIRED
  }
);

// ⭐ TTL index on createdAt (NOW IT WORKS)
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 5 * 24 * 60 * 60 }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
