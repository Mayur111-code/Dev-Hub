import React from "react";
import { FiEdit2, FiTrash2, FiPlay, FiHeart, FiMessageCircle } from "react-icons/fi";
import API from "../../api/axios";
import { toast } from "react-toastify";

export default function PostGridItem({ post, onOpen, isOwner, refresh }) {

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/posts/delete/${post._id}`);
      refresh();
      toast.success("Post deleted!");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onOpen(); 
  };

  
  const thumb = post.image || post.video || "https://placehold.co/600x400/indigo/white?text=Hub+Post";
  const isVideo = post.video || (typeof post.image === 'string' && post.image.includes(".mp4"));

  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-[2rem] bg-slate-200 aspect-square"
      onClick={onOpen}
    >
     
      <img 
        src={thumb} 
        alt="post" 
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* VIDEO INDICATOR */}
      {isVideo && (
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white p-2.5 rounded-2xl shadow-xl">
          <FiPlay size={18} fill="currentColor" />
        </div>
      )}

    
      {isOwner && (
        <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={handleEditClick} 
            className="p-2.5 bg-white/90 backdrop-blur-md text-slate-900 rounded-xl shadow-xl hover:bg-indigo-600 hover:text-white transition-all"
          >
            <FiEdit2 size={16} />
          </button>
          <button 
            onClick={handleDelete} 
            className="p-2.5 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-xl hover:bg-red-500 hover:text-white transition-all"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}

     
      <div className="absolute bottom-4 left-4 flex gap-4 translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-1.5 text-white font-black text-sm drop-shadow-md">
          <FiHeart size={18} className={post.likes?.length > 0 ? "fill-red-500 text-red-500" : ""} />
          {post.likes?.length || 0}
        </div>
        <div className="flex items-center gap-1.5 text-white font-black text-sm drop-shadow-md">
          <FiMessageCircle size={18} />
          {post.comments?.length || 0}
        </div>
      </div>

    
      {post.caption && (
        <div className="absolute bottom-12 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all delay-75 duration-300">
          <p className="text-white text-xs font-medium line-clamp-1 italic opacity-80">
            {post.caption}
          </p>
        </div>
      )}
    </div>
  );
}