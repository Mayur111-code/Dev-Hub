import { useState, useRef, useEffect } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import timeAgo from "../../utils/timeAgo";
import { X, Send, Trash2, MessageSquare, Loader2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function CommentsModal({ post, close, initialComments, onCommentsChange, onPostUpdate }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState(initialComments || post.comments || []);
  const authUser = useSelector((s) => s.user.user);
  const scrollRef = useRef(null);

  // Edit Comment state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setComments(initialComments || post.comments || []);
  }, [post._id, initialComments]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const syncComments = (updatedPost) => {
    if (!updatedPost?.comments) return;
    setComments(updatedPost.comments);
    onCommentsChange?.(updatedPost.comments);
    onPostUpdate?.(updatedPost);
  };

  const submitComment = async (e) => {
    e?.preventDefault?.();
    if (!comment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { data } = await API.put(`/posts/comment/${post._id}`, { text: comment });
      setComment("");
      syncComments(data?.post);
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const { data } = await API.delete(`/posts/comment/${post._id}/${commentId}`);
      syncComments(data?.post);
    } catch {
      toast.error("Error deleting comment");
    }
  };

  const startEdit = (c) => {
    setEditingCommentId(c._id);
    setEditingText(c.text);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const saveEdit = async (commentId) => {
    if (!editingText.trim() || isUpdating) return;
    try {
      setIsUpdating(true);
      const { data } = await API.put(`/posts/comment/${post._id}/${commentId}`, { text: editingText });
      syncComments(data?.post);
      setEditingCommentId(null);
      setEditingText("");
      toast.success("Comment updated!");
    } catch {
      toast.error("Failed to update comment");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-100 px-0 sm:px-4">
      <div className="bg-slate-800/50 border border-slate-700/30 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[80vh] sm:h-[600px] animate-in slide-in-from-bottom sm:zoom-in duration-300 backdrop-blur-sm">

        <div className="flex items-center justify-between p-4 border-b border-slate-700/30">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <h2 className="font-bold text-slate-200">Comments ({comments.length})</h2>
          </div>
          <button type="button" onClick={close} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="bg-slate-800/50 p-4 rounded-full mb-3">
                <MessageSquare size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-300 font-medium text-sm">No comments yet</p>
              <p className="text-slate-400 text-xs mt-1">Start the conversation!</p>
            </div>
          ) : (
            comments.map((c) => {
              const commentAuthor = c.user || {
                _id: "unknown",
                name: "Deleted User",
                avatar: "https://ui-avatars.com/api/?name=Deleted+User",
              };
              const isCommentOwner = commentAuthor._id === authUser?._id;

              return (
                <div key={c._id} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <Link to={commentAuthor._id !== "unknown" ? `/profile/${commentAuthor._id}` : "#"} onClick={commentAuthor._id !== "unknown" ? close : undefined}>
                    <img
                      src={commentAuthor.avatar}
                      className="w-9 h-9 rounded-full object-cover border border-slate-100"
                      alt={commentAuthor.name}
                    />
                  </Link>

                  <div className="flex-1">
                    <div className="bg-slate-800/50 rounded-2xl px-4 py-2.5 relative text-white">
                      <div className="flex justify-between items-center mb-0.5">
                        <Link to={commentAuthor._id !== "unknown" ? `/profile/${commentAuthor._id}` : "#"} onClick={commentAuthor._id !== "unknown" ? close : undefined} className="font-semibold text-slate-200 text-[13px] hover:text-indigo-600 transition-colors">
                          {commentAuthor.name}
                        </Link>
                        {isCommentOwner && editingCommentId !== c._id && (
                          <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => startEdit(c)}
                              className="text-slate-300 hover:text-indigo-600 transition-colors"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteComment(c._id)}
                              className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingCommentId === c._id ? (
                        <div className="mt-1.5 flex flex-col gap-2">
                          <input
                            autoFocus
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-xl text-sm text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(c._id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="px-3 py-1 text-[11px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEdit(c._id)}
                              disabled={!editingText.trim() || isUpdating}
                              className="px-3 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-lg transition-colors"
                            >
                              {isUpdating ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-200 text-sm leading-relaxed">{c.text}</p>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium ml-2 mt-1 uppercase tracking-tight">
                      {timeAgo(c.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-700/30 bg-slate-800/50 backdrop-blur-sm sm:rounded-b-2xl text-white">
          <div className="flex items-center gap-3">
            <img src={authUser?.avatar} className="w-8 h-8 rounded-full border border-slate-700 hidden sm:block" alt="me" />
            <div className="flex-1 relative flex items-center">
              <input autoFocus type="text" value={comment} placeholder="Write a thoughtful reply..." onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitComment(e); } }} className="w-full pl-4 pr-12 py-2.5 bg-slate-700/50 text-white placeholder:text-slate-400 border border-slate-600 rounded-full focus:ring-2 focus:ring-indigo-500/20 focus:bg-slate-600 outline-none transition-colors" />
              <button
                type="button"
                onClick={submitComment}
                disabled={!comment.trim() || isSubmitting}
                className="absolute right-1.5 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-sm"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
