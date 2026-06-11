import { X } from "lucide-react";
import PostCard from "../cards/PostCard";

export default function PostModal({ post, close, refresh, onPostUpdate, onPostDelete }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-8 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">

        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Post</h2>
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={close}
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-64px)] overflow-y-auto">
          <PostCard
            post={post}
            refresh={refresh}
            onPostUpdate={onPostUpdate}
            onPostDelete={(id) => { onPostDelete?.(id); close(); }}
          />
        </div>
      </div>
    </div>
  );
}
