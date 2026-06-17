import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import API from "../../api/axios";
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import LikesModal from "../modals/LikesModal";
import CommentsModal from "../modals/CommentsModal";
import EditPostModal from "../modals/EditPostModal";
import timeAgo from "../../utils/timeAgo";
import { normalizeLikeIds, normalizeLikedUsers, isPostLiked } from "../../utils/postHelpers";

export default function PostCard({ post, refresh, onPostUpdate, onPostDelete }) {
  const [isLiking, setIsLiking] = useState(false);
  const authUser = useSelector((s) => s.user.user);
  const [localLikes, setLocalLikes] = useState(() => normalizeLikeIds(post.likes));
  const [localLikedUsers, setLocalLikedUsers] = useState(() => normalizeLikedUsers(post.likes, post.likedUsers));
  const [localComments, setLocalComments] = useState(post.comments || []);
  const [modals, setModals] = useState({ likes: false, comments: false, edit: false });
  const [optionsOpen, setOptionsOpen] = useState(false);

  useEffect(() => {
    setLocalLikes(normalizeLikeIds(post.likes));
    setLocalLikedUsers(normalizeLikedUsers(post.likes, post.likedUsers));
    setLocalComments(post.comments || []);
  }, [post._id, post.likes, post.comments, post.likedUsers]);

  const author = post.author || {
    _id: "unknown",
    name: "Anonymous",
    avatar: "https://ui-avatars.com/api/?name=User",
  };

  const isOwner = authUser?._id === author._id;
  const isLiked = isPostLiked(localLikes, authUser?._id);

  const handleLike = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (isLiking || !authUser?._id) return;

    const prevLikes = localLikes;
    const prevLikedUsers = localLikedUsers;

    try {
      setIsLiking(true);
      setLocalLikes((prev) =>
        isPostLiked(prev, authUser._id)
          ? prev.filter((id) => id !== authUser._id)
          : [...prev, authUser._id]
      );

      const { data } = await API.put(`/posts/like/${post._id}`);
      const updatedPost = data?.post;
      if (updatedPost) {
        setLocalLikes(normalizeLikeIds(updatedPost.likes));
        setLocalLikedUsers(normalizeLikedUsers(updatedPost.likes, post.likedUsers));
        onPostUpdate?.(updatedPost);
      }
    } catch (err) {
      setLocalLikes(prevLikes);
      setLocalLikedUsers(prevLikedUsers);
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Remove this post permanently?")) return;
    try {
      await API.delete(`/posts/delete/${post._id}`);
      onPostDelete?.(post._id);
      if (!onPostDelete && typeof refresh === "function") refresh(true);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const toggleModal = (name, value) => setModals((prev) => ({ ...prev, [name]: value }));

  const handlePostUpdate = (updatedPost) => {
    if (updatedPost?.likes) {
      setLocalLikes(normalizeLikeIds(updatedPost.likes));
      setLocalLikedUsers(normalizeLikedUsers(updatedPost.likes, post.likedUsers));
    }
    if (updatedPost?.comments) setLocalComments(updatedPost.comments);
    onPostUpdate?.(updatedPost);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 20px 40px -12px rgba(99,102,241,0.25)" }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm transition-colors duration-300 hover:border-indigo-500/40"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${author._id}`}>
            <motion.img
              whileHover={{ scale: 1.08 }}
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${author._id}`}
              className="font-semibold text-white text-sm hover:text-indigo-400 transition-colors"
            >
              {author.name}
            </Link>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOptionsOpen(!optionsOpen)}
              className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>

            <AnimatePresence>
              {optionsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-44 bg-slate-900/95 border border-slate-700/50 shadow-2xl rounded-xl z-50 py-1 overflow-hidden backdrop-blur-xl"
                >
                  <button
                    type="button"
                    onClick={() => { toggleModal("edit", true); setOptionsOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
                  >
                    <Edit3 size={16} /> Edit Post
                  </button>
                  <button
                    type="button"
                    onClick={deletePost}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-slate-200 text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.image && (
        <div className="bg-slate-900/50 border-y border-slate-700/30 flex justify-center">
          {post.image.includes(".mp4") ? (
            <video controls className="w-full max-h-[500px]">
              <source src={post.image} type="video/mp4" />
            </video>
          ) : (
            <img
              src={post.image}
              alt="post"
              className="w-full h-auto max-h-[500px] object-contain"
            />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={() => toggleModal("likes", true)}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-400 transition-colors"
          >
            {localLikes.length} {localLikes.length === 1 ? "Like" : "Likes"}
          </button>
          <button
            type="button"
            onClick={() => toggleModal("comments", true)}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-400 transition-colors"
          >
            {localComments.length} {localComments.length === 1 ? "Comment" : "Comments"}
          </button>
        </div>

        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={handleLike}
            disabled={isLiking}
            whileTap={{ scale: 0.94 }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isLiked
                ? "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Heart size={19} fill={isLiked ? "currentColor" : "none"} className={isLiking ? "animate-pulse" : ""} />
            {isLiked ? "Liked" : "Like"}
          </motion.button>

          <motion.button
            type="button"
            onClick={() => toggleModal("comments", true)}
            whileTap={{ scale: 0.94 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <MessageCircle size={19} />
            Comment
          </motion.button>

          <motion.button
            type="button"
            onClick={() => {
              const url = `${window.location.origin}/post/${post._id}`;
              navigator.clipboard.writeText(url);
              toast.success("Link copied!");
            }}
            whileTap={{ scale: 0.94 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <Share2 size={19} />
            Share
          </motion.button>
        </div>
      </div>

      {modals.likes && <LikesModal likes={localLikedUsers} close={() => toggleModal("likes", false)} />}
      {modals.comments && (
        <CommentsModal
          post={post}
          initialComments={localComments}
          onCommentsChange={setLocalComments}
          onPostUpdate={handlePostUpdate}
          close={() => toggleModal("comments", false)}
        />
      )}
      {modals.edit && (
        <EditPostModal
          post={post}
          refresh={() => typeof refresh === "function" && refresh(true)}
          close={() => toggleModal("edit", false)}
        />
      )}
    </motion.div>
  );
}
