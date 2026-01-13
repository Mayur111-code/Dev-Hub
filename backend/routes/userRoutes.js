// import express from "express";
// import upload from "../middleware/upload.js";
// import authMiddleware from "../middleware/authMiddleware.js";
// import { followUser, getFollowers, getFollowing, getUserById, unfollowUser, updateProfile } from "../controllers/userController.js";

// const router = express.Router();

// // Get user (public)
// router.get("/:id", authMiddleware, getUserById);

// // Profile update API (supports avatar upload)
// router.put("/update", authMiddleware, upload.single("file"), updateProfile);


// // follow / unfollow
// router.put("/follow/:id", authMiddleware, followUser);
// router.put("/unfollow/:id", authMiddleware, unfollowUser);

// router.get("/followers/:id", authMiddleware, getFollowers);
// router.get("/following/:id", authMiddleware, getFollowing);


// export default router;



import express from "express";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  followUser,
  getFollowers,
  getFollowing,
  getUserById,
  unfollowUser,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

// ---------------- STATIC ROUTES FIRST -----------------

router.put("/update", authMiddleware, upload.single("file"), updateProfile);

router.put("/follow/:id", authMiddleware, followUser);
router.put("/unfollow/:id", authMiddleware, unfollowUser);

router.get("/followers/:id", authMiddleware, getFollowers);
router.get("/following/:id", authMiddleware, getFollowing);

// ---------------- DYNAMIC ROUTE LAST -------------------
router.get("/:id", authMiddleware, getUserById);

export default router;
