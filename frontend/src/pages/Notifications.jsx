import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import API from "../api/axios";
import timeAgo from "../utils/timeAgo";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/layout/Navbar";
import { AiOutlineBell, AiOutlineCheckCircle, AiOutlineDelete, AiOutlineInbox } from "react-icons/ai";
import { Zap } from "lucide-react";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      const { data } = await API.get("/notifications/my");
      setList(data);
    } catch (err) {
      toast.error("Failed to sync notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAll = async () => {
    try {
      await API.put("/notifications/read-all");
      setList((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All caught up!");
    } catch {
      toast.error("Failed to mark read");
    }
  };

  const markOne = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      setList((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch {
      toast.error("Action failed");
    }
  };

  const deleteOne = async (id) => {
    try {
      await API.delete(`/notifications/delete/${id}`);
      setList((prev) => prev.filter((n) => n._id !== id));
      toast.info("Notification removed");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center">
        <Navbar />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"
        />
        <motion.p
          className="text-slate-400 font-semibold"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading notifications…
        </motion.p>
      </div>
    );
  }

  const unreadCount = list.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-500/30 flex items-center gap-1">
                <Zap size={12} /> Hub Updates
              </span>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-rose-500/30">
                  {unreadCount} New
                </span>
              )}
            </motion.div>
            <motion.h1
              className="text-4xl sm:text-5xl font-black text-white tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              Activity
            </motion.h1>
            <motion.p
              className="text-slate-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your latest interactions and updates.
            </motion.p>
          </div>

          {list.some((n) => !n.isRead) && (
            <motion.button
              onClick={markAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-bold rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              <AiOutlineCheckCircle size={18} /> Mark All Read
            </motion.button>
          )}
        </motion.div>

        {/* Notification List */}
        <AnimatePresence mode="popLayout">
          {list.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-3xl p-16 text-center"
            >
              <motion.div
                className="w-20 h-20 bg-slate-800/50 border border-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <AiOutlineInbox className="text-slate-500 text-4xl" />
              </motion.div>
              <h3 className="text-white font-black text-xl">Inbox is Empty</h3>
              <p className="text-slate-400 text-sm mt-2">We'll let you know when something happens.</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.07 }}
            >
              {list.map((n, idx) => (
                <motion.div
                  key={n._id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
                    n.isRead
                      ? "bg-slate-800/30 border-slate-700/30 opacity-60 hover:opacity-100"
                      : "bg-slate-800/60 border-indigo-500/20 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/10"
                  }`}
                >
                  {/* Unread indicator */}
                  {!n.isRead && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
                  )}

                  <div className="flex items-center gap-4 pl-2">
                    {/* Avatar */}
                    <Link to={`/profile/${n.sender?._id}`} className="shrink-0">
                      <motion.img
                        whileHover={{ scale: 1.08 }}
                        src={n.sender?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700/50"
                        alt=""
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm leading-snug">
                        <Link
                          to={`/profile/${n.sender?._id}`}
                          className="font-black text-white hover:text-indigo-400 transition-colors"
                        >
                          {n.sender?.name}
                        </Link>
                        <span className="ml-1.5 text-slate-400 font-medium">
                          {n.type === "like" && "liked your recent post ❤️"}
                          {n.type === "comment" && "left a comment on your work 💬"}
                          {n.type === "follow" && "is now following your hub 👤"}
                          {n.type === "collab_request" && "sent you a collab request 🤝"}
                          {n.type === "collab_accepted" && "accepted the collaboration ✅"}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-indigo-400/70 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-indigo-500 block" />
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      {!n.isRead && (
                        <motion.button
                          onClick={() => markOne(n._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                          title="Mark as read"
                        >
                          <AiOutlineCheckCircle size={18} />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => deleteOne(n._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <AiOutlineDelete size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {list.length > 0 && (
          <motion.div
            className="mt-12 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-[1px] w-16 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
              animate={{ width: [64, 100, 64] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              {unreadCount > 0 ? `${unreadCount} unread · ` : "All caught up · "}{list.length} total
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}