import { useState, useEffect } from "react";
import API from "../api/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, ArrowRight, Lock } from "lucide-react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Sagali mahiti bhara!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });

      if (data.token) {
        dispatch(setUser({ user: data.user, token: data.token }));
        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("savedEmail");
        }
        toast.success(`Welcome back, ${data.user.name}! 🚀`);
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed! Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      developer: { email: "demo@dev.com", password: "demo123" },
      designer: { email: "demo@designer.com", password: "demo123" },
      founder: { email: "demo@founder.com", password: "demo123" }
    };
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
    toast.info(`${role} details filled!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      
      
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl z-10 relative">
        
       
        <div className="text-center mb-6">
          <div className="inline-flex p-1 bg-white/10 rounded-3xl shadow-lg border border-white/10 overflow-hidden mb-4">
            <img 
              src="/hublogo.jpg" 
              alt="Logo" 
              className="w-14 h-14 object-contain rounded-2xl transition-transform hover:scale-110 duration-500"
            />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">Authorize your session</p>
        </div>

        {/* QUICK ACCESS / DEMO BUTTONS */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 text-center">Quick Access</p>
          <div className="flex gap-2">
            {['developer', 'designer', 'founder'].map((role) => (
              <button
                key={role}
                onClick={() => handleDemoLogin(role)}
                className="flex-1 py-2 text-[9px] font-black uppercase tracking-tighter bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 rounded-xl transition-all active:scale-95"
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="email"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm placeholder:text-slate-700"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access Key</label>
              <Link to="/forgot" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-tighter">Recover?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-11 pr-12 py-3.5 bg-slate-900/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm placeholder:text-slate-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

   
          <label className="flex items-center gap-3 cursor-pointer group w-fit ml-1">
            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'border-white/10 group-hover:border-white/20'}`}>
              <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              {rememberMe && <div className="text-white text-[10px]">✓</div>}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Keep me active</span>
          </label>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 mt-2 group"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <> Unlock Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            New to the Hub?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-white transition-colors ml-1">
              Create an Identity
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}