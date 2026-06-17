import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import API from "../api/axios";
import PostCard from "../components/cards/PostCard";
import Navbar from "../components/layout/Navbar";
import { Plus, TrendingUp, Clock, Sparkles, RefreshCw, Flame, Zap } from "lucide-react";
import { toast } from "sonner";
import CreatePostModal from "../components/modals/CreatePostModal";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!user?._id) navigate("/login");
  }, [user, navigate]);

  const fetchPosts = useCallback(async (silent = false, showToast = false) => {
    try {
      if (!silent) setLoading(true);
      const { data } = await API.get("/posts/all");
      const safePosts = data.map((post) => ({
        ...post,
        user: post.user || { name: "Anonymous", _id: "unknown" },
      }));
      setPosts(safePosts);
      if (showToast) toast.success("Feed updated!");
    } catch {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePostUpdate = useCallback((updatedPost) => {
    if (!updatedPost?._id) return;
    setPosts((prev) =>
      prev.map((p) =>
        p._id === updatedPost._id
          ? { ...p, ...updatedPost, likedUsers: updatedPost.likes }
          : p
      )
    );
  }, []);

  const handlePostDelete = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const displayPosts = useMemo(() => {
    let result = [...posts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.content?.toLowerCase().includes(q) ||
          p.user?.name?.toLowerCase().includes(q)
      );
    }
    switch (activeFilter) {
      case "trending":
        return result.sort(
          (a, b) =>
            (b.likes?.length || 0) +
            (b.comments?.length || 0) -
            ((a.likes?.length || 0) + (a.comments?.length || 0))
        );
      case "recent":
        return result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "popular":
        return result.sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );
      default:
        return result;
    }
  }, [posts, searchQuery, activeFilter]);

  const filters = [
    { id: "all", label: "All", icon: <Zap size={14} /> },
    { id: "trending", label: "Trending", icon: <Flame size={14} /> },
    { id: "recent", label: "Recent", icon: <Clock size={14} /> },
    { id: "popular", label: "Popular", icon: <TrendingUp size={14} /> },
  ];

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <Navbar />
      {showCreateModal && (
        <CreatePostModal
          close={() => setShowCreateModal(false)}
          refresh={() => fetchPosts(true)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <motion.header
          className="flex justify-between items-end mb-10"
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
                <Zap size={12} /> Community Feed
              </span>
            </motion.div>
            <motion.h1
              className="text-4xl sm:text-5xl font-black text-white tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              What's Happening
            </motion.h1>
            <motion.p
              className="text-slate-400 mt-2 text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Explore what's trending in the dev community.
            </motion.p>
          </div>

          <motion.button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="hidden md:flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} /> New Post
          </motion.button>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Feed */}
          <main className="lg:col-span-8 space-y-6">
            {/* Filter Bar */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center gap-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      activeFilter === f.id
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => fetchPosts(true, true)}
                className="p-2.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
              >
                <RefreshCw size={18} />
              </button>
            </motion.div>

            {/* Posts */}
            <AnimatePresence mode="popLayout">
              {displayPosts.length > 0 ? (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.06 }}
                >
                  {displayPosts.map((post, idx) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <PostCard
                        post={post}
                        refresh={() => fetchPosts(true)}
                        onPostUpdate={handlePostUpdate}
                        onPostDelete={handlePostDelete}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-white">No results found</h3>
                  <p className="text-slate-400 mb-6">Try adjusting your filters.</p>
                  <button
                    onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                    className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            <motion.div
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" /> Platform Stats
              </h3>
              <div className="space-y-4">
                <StatRow
                  label="Global Posts"
                  value={posts.length}
                  color="text-indigo-400"
                />
                <StatRow
                  label="Total Reactions"
                  value={posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}
                  color="text-rose-400"
                />
                <StatRow
                  label="Comments"
                  value={posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}
                  color="text-emerald-400"
                />
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-bold text-lg mb-2">Upgrade your skills!</h4>
              <p className="text-indigo-200 text-sm mb-4">
                Join our weekly developer workshops and grow together.
              </p>
              <button className="w-full bg-white/10 border border-white/20 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">
                Explore Events
              </button>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Mobile FAB */}
      <motion.button
        onClick={() => setShowCreateModal(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        <Plus size={26} />
      </motion.button>
    </div>
  );
}

const StatRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-slate-400 text-sm">{label}</span>
    <motion.span
      className={`font-bold ${color}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
    >
      {value}
    </motion.span>
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center">
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
      Loading community feed…
    </motion.p>
  </div>
);