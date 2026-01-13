import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import PostCard from "../components/cards/PostCard";
import { Plus, Users, TrendingUp, Clock, Search, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import CreatePostModal from "../components/modals/CreatePostModal";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Auth Protection
  useEffect(() => {
    if (!user?._id) navigate("/login");
  }, [user, navigate]);

  // Fetch Logic
  const fetchPosts = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const { data } = await API.get("/posts/all");
      const safePosts = data.map((post) => ({
        ...post,
        user: post.user || { name: "Anonymous", _id: "unknown" },
      }));
      setPosts(safePosts);
      if (isRefresh) toast.success("Feed updated!");
    } catch (error) {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

 
  const displayPosts = useMemo(() => {
    let result = [...posts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.content?.toLowerCase().includes(q) || 
        p.user?.name?.toLowerCase().includes(q)
      );
    }

    // Sort/Filter
    switch (activeFilter) {
      case "trending":
        return result.sort((a, b) => ((b.likes?.length || 0) + (b.comments?.length || 0)) - ((a.likes?.length || 0) + (a.comments?.length || 0)));
      case "recent":
        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "popular":
        return result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      default:
        return result;
    }
  }, [posts, searchQuery, activeFilter]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-16 pb-12">
      {showCreateModal && <CreatePostModal close={() => setShowCreateModal(false)} refresh={fetchPosts} />}

      <div className="max-w-5xl mx-auto px-4 mt-4">
     
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Community Feed</h1>
            <p className="text-slate-500 mt-1">Explore what's happening in tech.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
          >
            <Plus size={18} /> New Post
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- Left Side: Filters & Feed --- */}
          <main className="lg:col-span-8 space-y-6">
           

            {/* Content Control */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex gap-6">
                {['all', 'trending', 'recent'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`pb-2 px-1 text-sm font-semibold capitalize transition-all ${
                      activeFilter === f ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button onClick={() => fetchPosts(true)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                <RefreshCw size={18} />
              </button>
            </div>

            {/* Posts List */}
            {displayPosts.length > 0 ? (
              <div className="space-y-4">
                {displayPosts.map(post => <PostCard key={post._id} post={post} refresh={fetchPosts} />)}
              </div>
            ) : (
              <EmptyState onReset={() => {setSearchQuery(""); setActiveFilter("all");}} />
            )}
          </main>

          {/* --- Right Side: Stats & Info --- */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" /> Platform Stats
              </h3>
              <div className="space-y-4">
                <StatRow label="Global Posts" value={posts.length} color="text-indigo-600" />
                <StatRow label="Total Reactions" value={posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)} color="text-rose-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
              <h4 className="font-bold text-lg mb-2">Upgrade your skills!</h4>
              <p className="text-indigo-100 text-sm mb-4">Join our weekly developer workshops and grow together.</p>
              <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">Explore Events</button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile FAB */}
      <button 
        onClick={() => setShowCreateModal(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}

// Sub-components for cleaner code
const StatRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const EmptyState = ({ onReset }) => (
  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
    <div className="text-5xl mb-4">🔍</div>
    <h3 className="text-lg font-bold text-slate-800">No results found</h3>
    <p className="text-slate-500 mb-6">Try adjusting your filters or search terms.</p>
    <button onClick={onReset} className="text-indigo-600 font-semibold hover:underline">Clear all filters</button>
  </div>
);

const LoadingSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 pt-24 space-y-8 animate-pulse">
    <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        <div className="h-14 bg-slate-200 rounded-xl w-full"></div>
        {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl w-full"></div>)}
      </div>
    </div>
  </div>
);