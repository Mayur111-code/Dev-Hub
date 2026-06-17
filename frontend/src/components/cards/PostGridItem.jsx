import React from "react";
import { motion } from "motion/react";
import { FiEdit2, FiTrash2, FiPlay, FiHeart, FiMessageCircle } from "react-icons/fi";
import API from "../../api/axios";
import { toast } from "sonner";

export default function PostGridItem({ post, onOpen, isOwner, refresh, onPostDelete }) {

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/posts/delete/${post._id}`);
      onPostDelete?.(post._id);
      if (!onPostDelete && typeof refresh === "function") refresh(true);
      toast.success("Post deleted!");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const thumb = post.image || post.video || "https://placehold.co/600x400/1e293b/6366f1?text=Post";
  const isVideo = post.video || (typeof post.image === "string" && post.image.includes(".mp4"));

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/40 aspect-square"
      onClick={onOpen}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {isVideo ? (
        <video
          src={thumb}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          muted
          playsInline
        />
      ) : (
        <img
          src={thumb}
          alt="post"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Video Indicator */}
      {isVideo && (
        <div className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md border border-white/10 text-white p-2.5 rounded-xl shadow-xl">
          <FiPlay size={16} fill="currentColor" />
        </div>
      )}

      {/* Owner Actions */}
      {isOwner && (
        <div className="absolute top-3 right-3 flex gap-1.5 translate-y-[-8px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={handleEditClick}
            className="p-2 bg-slate-900/80 backdrop-blur-md text-indigo-400 rounded-lg border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 bg-slate-900/80 backdrop-blur-md text-rose-400 rounded-lg border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="absolute bottom-3 left-3 flex gap-3 translate-y-[8px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-1.5 text-white font-bold text-sm drop-shadow-md">
          <FiHeart size={16} className={post.likes?.length > 0 ? "fill-rose-500 text-rose-400" : ""} />
          {post.likes?.length || 0}
        </div>
        <div className="flex items-center gap-1.5 text-white font-bold text-sm drop-shadow-md">
          <FiMessageCircle size={16} />
          {post.comments?.length || 0}
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="absolute bottom-10 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all delay-75 duration-300">
          <p className="text-slate-300 text-xs font-medium line-clamp-1 italic">
            {post.caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}