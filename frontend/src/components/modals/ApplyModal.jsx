import { useState, useEffect } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { X, Send, Sparkles, ShieldCheck, Loader2 } from "lucide-react";

export default function ApplyModal({ projectId, close, refresh }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [close]);

  const applyNow = async () => {
    const trimmedMsg = message.trim();
    if (!trimmedMsg) return toast.error("Please introduce yourself first!");
    if (trimmedMsg.length < 20) return toast.error("Write a bit more to impress the owner!");

    setLoading(true);
    try {
      await API.post(`/projects/apply/${projectId}`, { message: trimmedMsg });
      toast.success("Application flyin' high! 🚀");
      refresh();
      close();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex justify-center items-center z-[200] px-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative p-6 md:p-8 border-b border-slate-50">
          <button 
            onClick={close}
            className="absolute right-6 top-7 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Join the Team</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Application Portal</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Info Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 flex gap-3">
            <ShieldCheck className="text-indigo-500 shrink-0" size={20} />
            <p className="text-slate-600 text-sm leading-relaxed">
              Tell the owner why you're a great fit. Mention your <span className="font-bold text-slate-800">skills</span> and <span className="font-bold text-slate-800">past experience</span>.
            </p>
          </div>

          {/* Text Area */}
          <div className="space-y-2">
            <div className="flex justify-between items-end px-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Your Pitch</label>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                message.length > 450 ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'
              }`}>
                {message.length} / 500
              </span>
            </div>
            
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              placeholder="Hi! I'm interested because..."
              className="w-full h-40 p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 text-sm font-medium resize-none"
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={close}
              className="py-4 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all text-sm uppercase tracking-widest"
            >
              Back
            </button>
            <button
              onClick={applyNow}
              disabled={loading || !message.trim()}
              className="py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <span>Submit</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}