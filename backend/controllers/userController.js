import User from "../model/User.js";
import createNotification from "../utils/createNotification.js";
// UPDATE USER PROFILE (Cloudinary supported)
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills } = req.body;

    // If user uploaded new avatar (Cloudinary URL)
    const avatarUrl = req.file ? req.file.path : null;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields only if provided
    if (name) user.name = name;
    if (bio) user.bio = bio;

    // Skills can be array or comma-separated string
    if (skills) {
      if (Array.isArray(skills)) {
        user.skills = skills;
      } else {
        user.skills = skills.split(",").map(s => s.trim());
      }
    }

    // Update avatar if new one is uploaded
    if (avatarUrl) {
      user.avatar = avatarUrl;
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user
    });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by id (public)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Follow user


export const followUser = async (req, res) => {
  try {
    const meId = req.user.id;
    const toFollowId = req.params.id;

    if (meId === toFollowId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const me = await User.findById(meId);
    const other = await User.findById(toFollowId);

    if (!other) return res.status(404).json({ message: "User not found" });

    if (other.followers.includes(meId)) {
      return res.status(400).json({ message: "Already following" });
    }

    // Add follow
    other.followers.push(meId);
    me.following.push(toFollowId);

    await other.save();
    await me.save();

    // 🔥 CREATE FOLLOW NOTIFICATION
    await createNotification({
      user: toFollowId,        // notification goes TO this user
      sender: meId,            // user who followed
      type: "follow",          // we added this type
      postId: null,            // not from post
      projectId: null
    });

    res.json({ 
      message: "Followed", 
      followersCount: other.followers.length 
    });

  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const meId = req.user.id;
    const toUnfollowId = req.params.id;

    if (meId === toUnfollowId) {
      return res.status(400).json({ message: "Cannot unfollow yourself" });
    }

    const me = await User.findById(meId);
    const other = await User.findById(toUnfollowId);

    if (!other) return res.status(404).json({ message: "User not found" });

    other.followers = other.followers.filter((id) => id.toString() !== meId);
    me.following = me.following.filter((id) => id.toString() !== toUnfollowId);

    await other.save();
    await me.save();

    res.json({ message: "Unfollowed", followersCount: other.followers.length });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get followers list
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "name avatar bio")
      .select("followers");
    res.json(user.followers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get following list
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("following", "name avatar bio")
      .select("following");
    res.json(user.following);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
