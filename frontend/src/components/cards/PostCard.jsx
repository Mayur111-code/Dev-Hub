import { useState, useCallback } from "react";
import API from "../../api/axios";
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LikesModal from "../modals/LikesModal";
import CommentsModal from "../modals/CommentsModal";
import EditPostModal from "../modals/EditPostModal";
import timeAgo from "../../utils/timeAgo";

export default function PostCard({ post, refresh }) {
  const [isLiking, setIsLiking] = useState(false);
  const [modals, setModals] = useState({ likes: false, comments: false, edit: false });
  const [optionsOpen, setOptionsOpen] = useState(false);

  const authUser = useSelector((s) => s.user.user);

  const author = post.author || {
    _id: "unknown",
    name: "Anonymous",
    avatar: "https://ui-avatars.com/api/?name=User",
  };

  const isOwner = authUser?._id === author._id;
  const isLiked = post.likes?.includes(authUser?._id);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      
      await API.put(`/posts/like/${post._id}`);
      refresh(); // Refresh content
    } catch (err) {
      console.error("Like failed", err);
    } finally {
      setIsLiking(false);
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Remove this post permanently?")) return;
    await API.delete(`/posts/delete/${post._id}`);
    refresh();
  };

  const toggleModal = (name, value) => setModals(prev => ({ ...prev, [name]: value }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300">
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${author._id}`}>
            <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-50" />
          </Link>
          <div>
            <Link to={`/profile/${author._id}`} className="font-bold text-slate-900 text-sm hover:underline">
              {author.name}
            </Link>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button onClick={() => setOptionsOpen(!optionsOpen)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
              <MoreHorizontal size={20} />
            </button>
            
            {optionsOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 shadow-xl rounded-xl z-50 py-1 overflow-hidden">
                <button 
                  onClick={() => { toggleModal('edit', true); setOptionsOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <Edit3 size={16} /> Edit Post
                </button>
                <button 
                  onClick={deletePost}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-slate-800 text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Media Section */}
      {post.image && (
        <div className="bg-slate-50 border-y border-slate-100 flex justify-center">
          {post.image.includes(".mp4") ? (
            <video controls className="w-full max-h-[500px]">
              <source src={post.image} type="video/mp4" />
            </video>
          ) : (
            <img src={post.image} alt="post" className="w-full h-auto max-h-[500px] object-contain shadow-inner" />
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex -space-x-1.5 overflow-hidden" onClick={() => toggleModal('likes', true)}>
             {/* Small Like Avatars for visual appeal */}
             <div className="text-xs font-semibold text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors">
               {post.likes?.length || 0} Likes
             </div>
          </div>
          <div 
            onClick={() => toggleModal('comments', true)}
            className="text-xs font-semibold text-slate-500 cursor-pointer hover:text-indigo-600"
          >
            {post.comments?.length || 0} Comments
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
              isLiked ? "bg-rose-50 text-rose-600" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
            }`}
          >
            <Heart size={19} fill={isLiked ? "currentColor" : "none"} />
            Like
          </button>
          
          <button
            onClick={() => toggleModal('comments', true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
          >
            <MessageCircle size={19} />
            Comment
          </button>

          <button
            onClick={() => {
              const url = `${window.location.origin}/post/${post._id}`;
              navigator.clipboard.writeText(url);
              toast.success("Link copied!");
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
          >
            <Share2 size={19} />
            Share
          </button>
        </div>
      </div>

      {/* Modals */}
      {modals.likes && <LikesModal likes={post.likedUsers || []} close={() => toggleModal('likes', false)} />}
      {modals.comments && <CommentsModal post={post} refresh={refresh} close={() => toggleModal('comments', false)} />}
      {modals.edit && <EditPostModal post={post} refresh={refresh} close={() => toggleModal('edit', false)} />}
    </div>
  );
}