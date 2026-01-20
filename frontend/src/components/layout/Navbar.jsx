import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";
import { useState, useRef, useEffect } from "react";
import {
  FiMenu, FiX, FiSearch, FiPlus, FiBell, FiHome,
  FiCompass, FiLogOut, FiLayers, FiUser
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
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? "py-3 px-4" : "py-5 px-0"
        }`}>
        <div className={`max-w-7xl mx-auto px-6 h-16 flex items-center justify-between transition-all duration-300 ${scrolled
            ? "bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]"
            : "bg-transparent border-b border-white/5"
          }`}>

          {/* LEFT: LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img
                src="/devlogo.jpg"
                alt="dev Logo"
                className="relative w-9 h-9 object-contain rounded-lg border border-white/10"
              />
            </div>
            <span className="hidden sm:block text-xl font-bold tracking-widest uppercase text-slate-950">
              dev <span className="text-amber-400 border-b-2 border-amber-400/50">Hub</span>
            </span>
          </Link>

          {/* CENTER: SEARCH (Floating Style) */}
          <div className="hidden md:flex flex-1 justify-center max-w-md px-8">
            <div className="relative w-full group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-11 pr-4 py-2 bg-white/5 border border-white/10 rounded-full focus:ring-1 focus:ring-indigo-500/50 focus:bg-white/10 text-sm transition-all outline-none text-slate-200"
              />

              {showSearch && (
                <div className="absolute top-12 left-0 w-full bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  {results.map((u) => (
                    <Link key={u._id} to={`/profile/${u._id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-500/10 transition-colors" onClick={() => setShowSearch(false)}>
                      <img src={u.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                      <span className="text-sm font-medium text-slate-300">{u.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 mr-2">
              <NavLink icon={<FiHome size={18} />} to="/" title="Home" />
              <NavLink icon={<FiCompass size={18} />} to="/explore" title="Explore" />
              <NavLink icon={<FiLayers size={18} />} to="/projects" title="Projects" />
            </div>

            <Link to="/notifications" className="p-2.5 text-slate-400 hover:text-white relative">
              <FiBell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </Link>

            <div className="h-6 w-[1px] bg-white/10 mx-2 hidden md:block"></div>

            <Link to={`/profile/${user?._id}`} className="shrink-0 group relative">
              <img
                src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all shadow-lg"
                alt="Profile"
              />
            </Link>

            <button onClick={handleLogout} className="hidden md:block p-2.5 text-slate-400 hover:text-red-400 transition-colors">
              <FiLogOut size={19} />
            </button>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2 text-slate-300 hover:bg-white/10 rounded-lg" onClick={() => setOpen(!open)}>
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU (Slide Down) */}
        {open && (
          <div className="md:hidden absolute top-20 left-4 right-4 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 flex flex-col gap-2 shadow-2xl animate-in fade-in zoom-in duration-200">
            <MobileLink icon={<FiHome />} label="Home" to="/" onClick={() => setOpen(false)} />
            <MobileLink icon={<FiCompass />} label="Explore" to="/explore" onClick={() => setOpen(false)} />
            <MobileLink icon={<FiLayers />} label="Projects" to="/projects" onClick={() => setOpen(false)} />
            <MobileLink icon={<FiUser />} label="Profile" to={`/profile/${user?._id}`} onClick={() => setOpen(false)} />
            <div className="h-[1px] bg-white/5 my-2"></div>
            <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl w-full transition-all">
              <FiLogOut /> <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

// Sub-components for cleaner code
function NavLink({ icon, to, title }) {
  return (
    <Link to={to} title={title} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
      {icon}
    </Link>
  );
}

function MobileLink({ icon, label, to, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-4 p-4 text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-2xl transition-all font-medium">
      {icon} {label}
    </Link>
  );
}