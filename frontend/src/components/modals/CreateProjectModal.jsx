import { useState, useEffect } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { AiOutlineClose, AiOutlineCamera, AiOutlineProject } from "react-icons/ai";
import { Users, Tag, Text, ArrowRight } from "lucide-react";

export default function CreateProjectModal({ close, refresh }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [close]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) return toast.error("Max 5MB allowed");
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const createProject = async () => {
    if (!title.trim() || !desc.trim() || !teamSize) return toast.error("All fields are required");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", desc);
      form.append("tags", tags);
      form.append("teamSize", teamSize);
      if (file) form.append("file", file);

      await API.post("/projects/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Project launched! 🚀");
      refresh();
      close();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Launch failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/60 transition-all duration-300">
      
      {/* MODAL CARD */}
      <div className="bg-slate-900/90 border border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* TOP GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.8)]"></div>

        {/* HEADER */}
        <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <AiOutlineProject className="text-indigo-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">New Project</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Expansion Protocol</p>
            </div>
          </div>
          <button onClick={close} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 scrollbar-hide">
          
          {/* THUMBNAIL UPLOAD */}
          <div className="flex flex-col items-center group">
            <label className="relative cursor-pointer">
              <div className="w-32 h-32 rounded-[2rem] bg-slate-800 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group-hover:border-indigo-500/50 transition-all">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center">
                    <AiOutlineCamera className="text-slate-600 text-3xl mx-auto" />
                    <span className="text-[9px] font-black text-slate-600 uppercase mt-2 block tracking-tighter">Upload Cover</span>
                  </div>
                )}
              </div>
              <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
              {preview && (
                <div onClick={(e) => {e.preventDefault(); setPreview(null); setFile(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-lg shadow-lg hover:scale-110 transition-transform">
                  <AiOutlineClose size={12} />
                </div>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* TITLE */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mission Name</label>
              <div className="relative">
                <Text className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm placeholder:text-slate-700"
                  placeholder="e.g. Quantum Dashboard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Briefing</label>
              <textarea
                rows="3"
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm placeholder:text-slate-700 resize-none"
                placeholder="What are we building?"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* TAGS */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Stack Tags</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm placeholder:text-slate-700"
                    placeholder="React, Node"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>

              {/* TEAM SIZE */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Unit Limit</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                  <input
                    type="number"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="p-6 md:p-8 bg-white/5 border-t border-white/5 flex gap-3">
          <button onClick={close} className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
            Abort
          </button>
          <button
            onClick={createProject}
            disabled={loading}
            className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
              <> Initiate Launch <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}