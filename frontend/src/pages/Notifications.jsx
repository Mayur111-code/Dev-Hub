import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import timeAgo from "../utils/timeAgo";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineBell, AiOutlineCheckCircle, AiOutlineDelete, AiOutlineInbox } from "react-icons/ai";

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
      setList(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All caught up!");
    } catch (err) {
      toast.error("Failed to mark read");
    }
  };

  const markOne = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      setList(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const deleteOne = async (id) => {
    try {
      await API.delete(`/notifications/delete/${id}`);
      setList(prev => prev.filter(n => n._id !== id));
      toast.info("Notification removed");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return (
    <div className="pt-24 min-h-screen bg-[#F8FAFC] flex justify-center">
      <div className="w-full max-w-4xl px-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto min-h-screen bg-[#F8FAFC] pb-12">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
              <AiOutlineBell className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Activity</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Your Hub Updates</p>
            </div>
          </div>

          {list.some(n => !n.isRead) && (
            <button
              onClick={markAll}
              className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-sm"
            >
              <AiOutlineCheckCircle size={18} /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      {list.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AiOutlineInbox className="text-slate-300 text-4xl" />
          </div>
          <h3 className="text-slate-900 font-black text-xl">Inbox is Empty</h3>
          <p className="text-slate-400 text-sm mt-1">We'll let you know when something happens.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((n) => (
            <div
              key={n._id}
              className={`group relative p-5 rounded-[2rem] transition-all duration-300 border ${
                n.isRead 
                  ? "bg-white border-slate-100 opacity-75 hover:opacity-100" 
                  : "bg-white border-indigo-100 shadow-md ring-1 ring-indigo-50"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* User Avatar */}
                <Link to={`/profile/${n.sender?._id}`} className="shrink-0">
                  <img
                    src={n.sender?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                    alt=""
                  />
                </Link>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                  <div className="text-slate-800 text-sm sm:text-base leading-snug">
                    <Link to={`/profile/${n.sender?._id}`} className="font-black hover:text-indigo-600">
                      {n.sender?.name}
                    </Link>
                    <span className="ml-1 text-slate-500 font-medium">
                      {n.type === "like" && "liked your recent post ❤️"}
                      {n.type === "comment" && "left a comment on your work 💬"}
                      {n.type === "follow" && "is now following your hub 👤"}
                      {n.type === "collab_request" && "sent you a collab request 🤝"}
                      {n.type === "collab_accepted" && "accepted the collaboration ✅"}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 block"></span>
                    {timeAgo(n.createdAt)}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  {!n.isRead && (
                    <button
                      onClick={() => markOne(n._id)}
                      className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                      title="Read"
                    >
                      <AiOutlineCheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteOne(n._id)}
                    className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <AiOutlineDelete size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER STATS */}
      {list.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
             {list.filter(n => !n.isRead).length} New Updates
          </div>
        </div>
      )}
    </div>
  );
}