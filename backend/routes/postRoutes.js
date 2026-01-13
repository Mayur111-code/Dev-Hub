import express from "express";
import {
  createPost,
  getPosts,
  likePost,
  addComment,
  updatePost,
  deletePost,
  getPostsByUser,
  deleteComment,
  
} from "../controllers/postController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// CREATE POST (supports image/video upload)
router.post("/create", authMiddleware, upload.single("file"), createPost);

// UPDATE POST (supports new image/video upload)
router.put("/update/:id", authMiddleware, upload.single("file"), updatePost);

// DELETE POST
router.delete("/delete/:id", authMiddleware, deletePost);

// GET ALL POSTS
router.get("/all", authMiddleware, getPosts);

//get post by user
router.get("/user/:id", authMiddleware, getPostsByUser);

// LIKE POST
router.put("/like/:id", authMiddleware, likePost);

// ADD COMMENT
router.put("/comment/:id", authMiddleware, addComment);
router.delete("/comment/:id/:commentId", authMiddleware, deleteComment);




export default router;
