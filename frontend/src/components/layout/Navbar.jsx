import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";
import { useState, useRef } from "react";
import {
  FiMenu, FiX, FiSearch, FiPlus, FiBell, FiHome,
  FiCompass, FiLogOut, FiLayers
} from "react-icons/fi";
import CreateProjectModal from "../modals/CreateProjectModal";
import API from "../../api/axios";
import { toast } from "react-toastify";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user.user);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Connection Terminated 👋");
  };

  const handleSearch = async (text) => {
    setSearch(text);
    if (text.trim() === "") {
      setResults([]);
      setShowSearch(false);
      return;
    }
    try {
      const { data } = await API.get(`/search?q=${text}`);
      setResults(data);
      setShowSearch(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {openCreate && (
        <CreateProjectModal
          close={() => setOpenCreate(false)}
          refresh={() => window.location.reload()}
        />
      )}

      <nav className="bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 fixed top-0 left-0 w-full z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

          {/* LOGO SECTION */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="p-1.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-indigo-500/50 transition-all">
              <img
                src="/hublogo.jpg"
                alt="InfinaHub"
                className="w-8 h-8 object-contain rounded-lg"
              />
            </div>
            
            <div className="md:hidden relative flex-1 mx-3" ref={searchRef}>
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search protocol..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/5 rounded-xl text-white text-xs font-bold outline-none"
              />

              {showSearch && (
                <div className="absolute top-11 left-0 w-full bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  {results.map((u) => (
                    <Link
                      key={u._id}
                      to={`/profile/${u._id}`}
                      onClick={() => setShowSearch(false)}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors"
                    >
                      <img
                        src={u.avatar}
                        className="w-8 h-8 rounded-lg object-cover border border-white/10"
                        alt=""
                      />
                      <span className="text-xs font-black uppercase text-slate-300 tracking-widest">
                        {u.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="hidden sm:block">
              <span className="text-lg font-black text-white tracking-tighter uppercase italic">Infina<span className="text-indigo-500">Hub</span></span>
              <div className="h-[1px] w-full bg-gradient-to-r from-indigo-500 to-transparent"></div>
            </div>
          </Link>

          {/* SEARCH BAR */}
          <div className="hidden md:block relative w-full max-w-xs lg:max-w-sm mx-8" ref={searchRef}>
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search protocol..."
                className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/10 text-white text-xs font-bold transition-all placeholder:text-slate-600 outline-none"
              />
            </div>

            {showSearch && (
              <div className="absolute top-14 left-0 w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                {results.map((u) => (
                  <Link key={u._id} to={`/profile/${u._id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors" onClick={() => setShowSearch(false)}>
                    <img src={u.avatar} className="w-8 h-8 rounded-lg object-cover border border-white/10" alt="" />
                    <span className="text-xs font-black uppercase text-slate-300 tracking-widest">{u.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>


          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link title="Home" to="/" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><FiHome size={20} /></Link>
            <Link title="Explore" to="/explore" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><FiCompass size={20} /></Link>


            <Link title="Projects" to="/projects" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <FiLayers size={20} />
            </Link>


            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

            <Link to="/notifications" className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <FiBell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
            </Link>

            <Link to={`/profile/${user?._id}`} className="shrink-0 ml-1">
              <img
                src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-9 h-9 rounded-xl object-cover border-2 border-white/5 hover:border-indigo-500 transition-all"
                alt="Me"
              />
            </Link>

            <button onClick={handleLogout} className="p-2.5 text-slate-500 hover:text-red-500 transition-colors">
              <FiLogOut size={20} />
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="md:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10" onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}

        {open && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-6 flex flex-col gap-3 shadow-2xl backdrop-blur-3xl">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-[10px]">
              <FiHome /> Home
            </Link>
            <Link to="/explore" onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-[10px]">
              <FiCompass /> Explore
            </Link>
            <Link to="/projects" onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-[10px]">
              <FiLayers /> Projects
            </Link>
            <Link to="/notifications" onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-[10px]">
              <FiBell /> Notifications
            </Link>
            <Link
  to={`/profile/${user?._id}`}
  onClick={() => setOpen(false)}
  className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-[10px]"
>
  <img
    src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
    className="w-5 h-5 rounded-full object-cover border border-white/10"
    alt="Profile"
  />
  Profile
</Link>

            <button onClick={handleLogout} className="flex items-center gap-4 p-4 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-2">
              <FiLogOut /> Terminate
            </button>
          </div>
        )}
      </nav>
    </>
  );
}