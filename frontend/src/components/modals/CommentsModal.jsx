import { useState, useRef, useEffect } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import timeAgo from "../../utils/timeAgo";
import { X, Send, Trash2, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

export default function CommentsModal({ post, close, refresh }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authUser = useSelector((s) => s.user.user);
  const scrollRef = useRef(null);

  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [post.comments]);

  const submitComment = async () => {
    if (!comment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await API.put(`/posts/comment/${post._id}`, { text: comment });
      setComment("");
      refresh();
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await API.delete(`/posts/comment/${post._id}/${commentId}`);
      refresh();
    } catch (err) {
      toast.error("Error deleting comment");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-[100] px-0 sm:px-4">
      
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[80vh] sm:h-[600px] animate-in slide-in-from-bottom sm:zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <h2 className="font-bold text-slate-800">Comments ({post.comments?.length || 0})</h2>
          </div>
          <button onClick={close} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth">
          {(post.comments || []).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="bg-slate-50 p-4 rounded-full mb-3">
                <MessageSquare size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium text-sm">No comments yet</p>
              <p className="text-slate-400 text-xs mt-1">Start the conversation!</p>
            </div>
          ) : (
            post.comments.map((c) => (
              <div key={c._id} className="flex gap-3 group">
                <Link to={`/profile/${c.user._id}`} onClick={close}>
                  <img
                    src={c.user.avatar}
                    className="w-9 h-9 rounded-full object-cover border border-slate-100"
                    alt={c.user.name}
                  />
                </Link>

                <div className="flex-1">
                  <div className="bg-slate-50 rounded-2xl px-4 py-2.5 relative">
                    <div className="flex justify-between items-center mb-0.5">
                      <Link to={`/profile/${c.user._id}`} onClick={close} className="font-bold text-slate-900 text-[13px] hover:text-indigo-600 transition-colors">
                        {c.user.name}
                      </Link>
                      {c.user._id === authUser._id && (
                        <button
                          onClick={() => deleteComment(c._id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{c.text}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold ml-2 mt-1 uppercase tracking-tight">
                    {timeAgo(c.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Input Section */}
        <div className="p-4 border-t border-slate-100 bg-white sm:rounded-b-2xl">
          <div className="flex items-center gap-3">
            <img src={authUser?.avatar} className="w-8 h-8 rounded-full border border-slate-200 hidden sm:block" alt="me" />
            <div className="flex-1 relative flex items-center">
              <input
                autoFocus
                type="text"
                value={comment}
                placeholder="Write a thoughtful reply..."
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                className="w-full pl-4 pr-12 py-2.5 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all outline-none"
              />
              <button
                onClick={submitComment}
                disabled={!comment.trim() || isSubmitting}
                className="absolute right-1.5 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
            Press Enter to post
          </p>
        </div>
      </div>
    </div>
  );
}