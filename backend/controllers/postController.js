import Post from "../model/Post.js";
import createNotification from "../utils/createNotification.js";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { content, image, video } = req.body;

    if (!content && !image && !video) {
      return res.status(400).json({ message: "Content or media required" });
    }

    const post = await Post.create({
      author: req.user.id,
      content: content || "",
      image: image || null,
      video: video || null,
    });

    res.json({ message: "Post created", post });

  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL POSTS (WITH POPULATED LIKES)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar")
      .populate("likes", "name avatar")
      .sort({ createdAt: -1 });

    const finalPosts = posts.map((p) => ({
      ...p.toObject(),
      likedUsers: p.likes, // important
    }));

    res.json(finalPosts);
  } catch (err) {
    console.error("Error getting posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET POSTS BY USER (WITH POPULATED LIKES)
export const getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ author: userId })
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar")
      .populate("likes", "name avatar")
      .sort({ createdAt: -1 });

    const finalPosts = posts.map((p) => ({
      ...p.toObject(),
      likedUsers: p.likes,
    }));

    res.json(finalPosts);
  } catch (err) {
    console.error("Error getting user posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// LIKE - UNLIKE POST
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id.toString();

    if (!post.likes.includes(userId)) {
      post.likes.push(req.user.id);

      if (post.author.toString() !== userId) {
        await createNotification({
          user: post.author,
          sender: userId,
          type: "like",
          postId: post._id,
        });
      }
    } else {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    }

    await post.save();

    const updated = await Post.findById(post._id)
      .populate("likes", "name avatar");

    res.json({ message: "Like toggled", post: updated });

  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text.trim()) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: req.user.id,
      text
    });

    await post.save();

    if (post.author.toString() !== req.user.id) {
      await createNotification({
        user: post.author,
        sender: req.user.id,
        type: "comment",
        postId: post._id,
      });
    }

    const updated = await Post.findById(post._id)
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar");

    res.json({ message: "Comment added", post: updated });

  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const mediaUrl = req.file ? req.file.path : post.image;

    post.content = content || post.content;
    post.image = mediaUrl;
    post.video = mediaUrl;

    await post.save();

    res.json({ message: "Post updated", post });

  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });

  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.user.toString() !== req.user.id &&
      post.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: "Comment deleted", post });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


