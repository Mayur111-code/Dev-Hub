import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../api/axios";
import { toast } from "react-toastify";

// Icons
import { 
  AiOutlineSetting, AiOutlineEnvironment, AiOutlineFileText, 
  AiOutlineMessage, AiOutlineShareAlt, AiOutlineClose, AiOutlineThunderbolt
} from "react-icons/ai";
import { FiGithub, FiTwitter, FiLinkedin, FiGlobe, FiMail } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

// Sub-components
import EditProfileModal from "../components/modals/EditProfileModal";
import PostGridItem from "../components/cards/PostGridItem";
import PostModal from "../components/modals/PostModal";

export default function Profile() {
  const { id } = useParams();
  const authUser = useSelector((s) => s.user.user);
  
  // Data States
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [activeTab, setActiveTab] = useState("posts");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  
  // Modal State for Followers/Following
  const [listModal, setListModal] = useState({ show: false, title: "", data: [] });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: u }, { data: p }] = await Promise.all([
        API.get(`/user/${id}`),
        API.get(`/posts/user/${id}`)
      ]);

      setUser(u);
      setPosts(p);
      setFollowersCount(u.followers?.length || 0);
      
      const isActuallyFollowing = authUser 
        ? (u.followers || []).some(f => (f._id || f) === authUser._id) 
        : false;
      setIsFollowing(isActuallyFollowing);
    } catch (err) {
      toast.error("Profile load karayla problem yetoy!");
    } finally {
      setLoading(false);
    }
  }, [id, authUser?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFollowToggle = async () => {
    if (!authUser) return toast.warning("Please login first");
    const action = isFollowing ? 'unfollow' : 'follow';
    try {
      const { data } = await API.put(`/user/${action}/${id}`);
      setIsFollowing(!isFollowing);
      setFollowersCount(data.followersCount);
      toast.success(isFollowing ? "Unfollowed" : `Following ${user.name}`);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const fetchListData = async (type) => {
    try {
      const { data } = await API.get(`/user/${type}/${id}`);
      setListModal({ show: true, title: type === 'followers' ? 'Followers' : 'Following', data });
    } catch (err) {
      toast.error("Could not load list");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const isOwner = authUser?._id === user?._id;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* PROFILE MAIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-10">
            {/* Avatar Section */}
            <div className="shrink-0">
              <img
                src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl"
                alt="Profile"
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-3">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                <div className="flex justify-center gap-2">
                  {isOwner ? (
                    <button onClick={() => setOpenEdit(true)} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all text-sm">
                      <AiOutlineSetting /> Setup Hub
                    </button>
                  ) : (
                    <button 
                      onClick={handleFollowToggle}
                      className={`px-8 py-2 rounded-xl font-black text-sm transition-all ${isFollowing ? 'bg-slate-100 text-slate-500' : 'bg-indigo-600 text-white'}`}
                    >
                      {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                    </button>
                  )}
                </div>
              </div>

              {/* <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-4">{user.title || "Full Stack Developer"}</p> */}
              <p className="text-slate-500 font-medium leading-relaxed mb-6 max-w-xl">{user.bio || "No bio added yet."}</p>

             
              {user.skills?.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                  {user.skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-100">
                      <AiOutlineThunderbolt className="text-indigo-400" /> {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* STATS */}
              <div className="flex gap-8 justify-center lg:justify-start border-t border-slate-50 pt-6">
                <div onClick={() => fetchListData('followers')} className="cursor-pointer group">
                  <span className="block text-xl font-black text-slate-900 group-hover:text-indigo-600">{followersCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Followers</span>
                </div>
                <div onClick={() => fetchListData('following')} className="cursor-pointer group">
                  <span className="block text-xl font-black text-slate-900 group-hover:text-indigo-600">{user.following?.length || 0}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Following</span>
                </div>
                <div>
                  <span className="block text-xl font-black text-slate-900">{posts.length}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT TABS */}
        <div className="flex gap-4 mb-8">
          {['posts', 'projects'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FEED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'posts' ? (
            posts.length > 0 ? (
              posts.map(post => <PostGridItem key={post._id} post={post} onOpen={() => setSelectedPost(post)} isOwner={isOwner} refresh={fetchData} />)
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-300 font-bold uppercase tracking-tighter">No Posts Found</div>
            )
          ) : (
             <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-300 font-bold uppercase tracking-tighter">Coming Soon</div>
          )}
        </div>
      </div>

      {/* MODAL LIST (Followers/Following) */}
      {listModal.show && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{listModal.title}</h2>
              <button onClick={() => setListModal({ ...listModal, show: false })}><AiOutlineClose/></button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {listModal.data.map(u => (
                <Link key={u._id} to={`/profile/${u._id}`} onClick={() => setListModal({ ...listModal, show: false })} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-2xl transition-all">
                  <img src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-11 h-11 rounded-xl object-cover" />
                  <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {openEdit && <EditProfileModal user={user} close={() => { setOpenEdit(false); fetchData(); }} />}
      {selectedPost && <PostModal post={selectedPost} close={() => setSelectedPost(null)} refresh={fetchData} />}
    </div>
  );
}