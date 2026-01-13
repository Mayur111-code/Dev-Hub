import { Link } from "react-router-dom";
import { X, Heart } from "lucide-react";

export default function LikesModal({ likes = [], close }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[110] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-rose-50 p-1.5 rounded-lg">
              <Heart size={18} className="text-rose-500" fill="currentColor" />
            </div>
            <h2 className="font-bold text-slate-800 text-base">Liked by</h2>
          </div>
          <button 
            onClick={close} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Likes List */}
        <div className="max-h-[400px] overflow-y-auto py-2 custom-scrollbar">
          {likes.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={30} className="text-slate-200" />
              </div>
              <p className="text-slate-500 font-semibold text-sm">No likes yet</p>
              <p className="text-slate-400 text-xs mt-1">When someone likes this post, they'll show up here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {likes.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u._id}`}
                  onClick={close}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors group"
                >
                  <img
                    src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`}
                    className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                    alt={u.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                      {u.name}
                    </p>
                    {u.headline || u.bio ? (
                      <p className="text-[12px] text-slate-500 truncate leading-tight">
                        {u.headline || u.bio}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">Member</p>
                    )}
                  </div>
                  
                  
                  <div className="text-[10px] font-bold text-slate-300 group-hover:text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                    View
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info Bar */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-center">
             {likes.length} Total {likes.length === 1 ? 'Reaction' : 'Reactions'}
           </p>
        </div>
      </div>
    </div>
  );
}