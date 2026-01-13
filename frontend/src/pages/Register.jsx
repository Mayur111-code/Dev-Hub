import { useState } from "react";
import API from "../api/axios";
import { setUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Github, Twitter, Mail, User, Camera, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Valid email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid format";
    if (!password || password.length < 6) newErrors.password = "Min 6 characters required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      toast.success("Photo added! 📸");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      let avatarURL = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const upload = await API.post("/upload/file", formData);
        avatarURL = upload.data.url;
      }

      const { data } = await API.post("/auth/register", {
        name, email, password, avatar: avatarURL,
      });

      dispatch(setUser({ user: data.user, token: data.token }));
      toast.success(`Welcome to InfinaHub, ${data.user.name}! 🎉`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      
      {/* GLOWING BACKGROUND */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl z-10 relative">
        
        {/* LOGO & TITLE */}
        <div className="text-center mb-6">
          <div className="inline-flex p-1 bg-white/10 rounded-3xl shadow-lg border border-white/10 overflow-hidden mb-4">
            <img 
              src="/hublogo.jpg" 
              alt="Logo" 
              className="w-14 h-14 object-contain rounded-2xl"
            />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Create Identity</h2>
          <p className="text-slate-400 text-sm mt-1">Join the developer elite</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* AVATAR UPLOAD */}
          <div className="flex flex-col items-center mb-2">
            <label className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500/50">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  <Camera className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                )}
              </div>
              <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-lg shadow-lg">
                <ArrowRight size={12} className="text-white -rotate-45" />
              </div>
            </label>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-3">Profile Signal</span>
          </div>

          {/* NAME */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                className={`w-full pl-11 pr-4 py-3 bg-slate-900/50 border ${errors.name ? 'border-red-500/50' : 'border-white/5'} rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm`}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="email"
                className={`w-full pl-11 pr-4 py-3 bg-slate-900/50 border ${errors.email ? 'border-red-500/50' : 'border-white/5'} rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm`}
                placeholder="dev@infina.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Key</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 pr-12 py-3 bg-slate-900/50 border ${errors.password ? 'border-red-500/50' : 'border-white/5'} rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-emerald-600/10 transition-all flex items-center justify-center gap-2 mt-2 group"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <> Initialize Profile <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Already a member?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-white transition-colors ml-1">
              Authorize Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}