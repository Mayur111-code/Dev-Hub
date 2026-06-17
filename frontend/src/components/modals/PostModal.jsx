import { X } from "lucide-react";
import PostCard from "../cards/PostCard";
import { motion, AnimatePresence } from "framer-motion";

export default function PostModal({ post, close, refresh, onPostUpdate, onPostDelete }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[200] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-slate-800/50 border border-slate-700/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-md shadow-xl"
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-700/30">
            <h2 className="text-lg font-bold text-white">Post</h2>
            <button onClick={close} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
          {/* Content */}
          <div className="max-h-[calc(90vh-64px)] overflow-y-auto">
            <PostCard
              post={post}
              refresh={refresh}
              onPostUpdate={onPostUpdate}
              onPostDelete={(id) => { onPostDelete?.(id); close(); }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
