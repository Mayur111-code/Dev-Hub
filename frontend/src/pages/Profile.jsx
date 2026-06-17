import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import API from "../api/axios";
import { toast } from "sonner";
import Navbar from "../components/layout/Navbar";

// Icons
import {
  AiOutlineSetting, AiOutlineClose, AiOutlineThunderbolt
} from "react-icons/ai";
import { FiGithub, FiTwitter, FiLinkedin, FiGlobe } from "react-icons/fi";

// Sub-components
import EditProfileModal from "../components/modals/EditProfileModal";
import PostGridItem from "../components/cards/PostGridItem";
import PostModal from "../components/modals/PostModal";

export default function Profile() {
  const { id } = useParams();
  const authUser = useSelector((s) => s.user.user);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [listModal, setListModal] = useState({ show: false, title: "", data: [] });

  const fetchData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const [{ data: u }, { data: p }] = await Promise.all([
          API.get(`/user/${id}`),
          API.get(`/posts/user/${id}`),
        ]);
        setUser(u);
        setPosts(p);
        setFollowersCount(u.followers?.length || 0);
        const isActuallyFollowing = authUser
          ? (u.followers || []).some((f) => (f._id || f) === authUser._id)
          : false;
        setIsFollowing(isActuallyFollowing);
        setSelectedPost((prev) => {
          if (!prev) return prev;
          return p.find((post) => post._id === prev._id) || prev;
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    },
    [id, authUser?._id]
  );

  const handlePostUpdate = useCallback((updatedPost) => {
    if (!updatedPost?._id) return;
    setPosts((prev) =>
      prev.map((p) =>
        p._id === updatedPost._id
          ? { ...p, ...updatedPost, likedUsers: updatedPost.likes }
          : p
      )
    );
    setSelectedPost((prev) =>
      prev?._id === updatedPost._id
        ? { ...prev, ...updatedPost, likedUsers: updatedPost.likes }
        : prev
    );
  }, []);

  const handlePostDelete = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setSelectedPost((prev) => (prev?._id === postId ? null : prev));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFollowToggle = async () => {
    if (!authUser) return toast.warning("Please login first");
    const action = isFollowing ? "unfollow" : "follow";
    try {
      const { data } = await API.put(`/user/${action}/${id}`);
      setIsFollowing(!isFollowing);
      setFollowersCount(data.followersCount);
      toast.success(isFollowing ? "Unfollowed" : `Following ${user.name}`);
    } catch {
      toast.error("Action failed");
    }
  };

  const fetchListData = async (type) => {
    try {
      const { data } = await API.get(`/user/${type}/${id}`);
      setListModal({
        show: true,
        title: type === "followers" ? "Followers" : "Following",
        data,
      });
    } catch {
      toast.error("Could not load list");
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
          Loading profile…
        </motion.p>
      </div>
    );
  }

  const isOwner = authUser?._id === user?._id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">

        {/* PROFILE HERO CARD */}
        <motion.div
          className="relative bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 md:p-12 mb-8 overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-10">
            {/* Avatar */}
            <motion.div
              className="shrink-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-40" />
                <img
                  src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] object-cover border-2 border-white/10"
                  alt="Profile"
                />
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-3">
                <motion.h1
                  className="text-4xl font-black text-white tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {user.name}
                </motion.h1>
                <motion.div
                  className="flex justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {isOwner ? (
                    <button
                      onClick={() => setOpenEdit(true)}
                      className="flex items-center gap-2 px-5 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-xl font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-sm"
                    >
                      <AiOutlineSetting /> Setup Hub
                    </button>
                  ) : (
                    <motion.button
                      onClick={handleFollowToggle}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={`px-7 py-2 rounded-xl font-black text-sm transition-all ${
                        isFollowing
                          ? "bg-slate-700/50 border border-slate-600/50 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30"
                          : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      }`}
                    >
                      {isFollowing ? "FOLLOWING" : "FOLLOW"}
                    </motion.button>
                  )}
                </motion.div>
              </div>

              <motion.p
                className="text-slate-400 leading-relaxed mb-6 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                {user.bio || "No bio added yet."}
              </motion.p>

              {/* Skills */}
              {user.skills?.length > 0 && (
                <motion.div
                  className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {user.skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-500/20"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(99,102,241,0.2)" }}
                    >
                      <AiOutlineThunderbolt className="text-indigo-400" /> {skill}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* Stats */}
              <motion.div
                className="flex gap-8 justify-center lg:justify-start border-t border-slate-700/40 pt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {[
                  { label: "Followers", value: followersCount, onClick: () => fetchListData("followers") },
                  { label: "Following", value: user.following?.length || 0, onClick: () => fetchListData("following") },
                  { label: "Posts", value: posts.length, onClick: null },
                ].map(({ label, value, onClick }) => (
                  <div
                    key={label}
                    onClick={onClick}
                    className={`group ${onClick ? "cursor-pointer" : ""}`}
                  >
                    <span className="block text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">
                      {value}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* TABS */}
        <motion.div
          className="flex gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {["posts", "projects"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-7 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* POSTS GRID */}
        <AnimatePresence mode="wait">
          {activeTab === "posts" ? (
            <motion.div
              key="posts"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {posts.length > 0 ? (
                posts.map((post, idx) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <PostGridItem
                      post={post}
                      onOpen={() => setSelectedPost(post)}
                      isOwner={isOwner}
                      refresh={() => fetchData(true)}
                      onPostDelete={handlePostDelete}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="col-span-full py-20 text-center bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-4xl mb-3">📸</div>
                  <p className="text-slate-500 font-bold uppercase tracking-tighter text-sm">No Posts Yet</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="projects"
              className="py-20 text-center bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="text-4xl mb-3">🚀</div>
              <p className="text-slate-500 font-bold uppercase tracking-tighter text-sm">Coming Soon</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Followers/Following Modal */}
      <AnimatePresence>
        {listModal.show && (
          <motion.div
            className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 border border-slate-700/50 w-full max-w-sm rounded-3xl p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white tracking-tight">{listModal.title}</h2>
                <button
                  onClick={() => setListModal({ ...listModal, show: false })}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {listModal.data.map((u) => (
                  <Link
                    key={u._id}
                    to={`/profile/${u._id}`}
                    onClick={() => setListModal({ ...listModal, show: false })}
                    className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all"
                  >
                    <img
                      src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700/50"
                      alt=""
                    />
                    <p className="font-bold text-slate-200 text-sm">{u.name}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {openEdit && (
        <EditProfileModal user={user} close={() => { setOpenEdit(false); fetchData(); }} />
      )}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          close={() => setSelectedPost(null)}
          refresh={() => fetchData(true)}
          onPostUpdate={handlePostUpdate}
          onPostDelete={handlePostDelete}
        />
      )}
    </div>
  );
}