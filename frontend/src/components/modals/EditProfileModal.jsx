import { useState, useEffect } from "react";
import API from "../../api/axios";
import { X, Camera, User, FileText, Wrench, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function EditProfileModal({ user, close }) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [skills, setSkills] = useState((user.skills || []).join(", "));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.avatar || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => { if (preview && file) URL.revokeObjectURL(preview); };
  }, [preview, file]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const save = async () => {
    if (!name.trim()) return toast.error("Name is required");
    
    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", name);
      form.append("bio", bio);
      form.append("skills", skills);
      if (file) form.append("file", file);

      await API.put("/user/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated!");
      close();
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[150] px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>
          <button onClick={close} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={preview || "https://ui-avatars.com/api/?name=User"}
                className="w-28 h-28 rounded-3xl object-cover ring-4 ring-slate-50 shadow-md group-hover:brightness-90 transition-all"
                alt="Profile"
              />
              <label className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 text-white rounded-xl cursor-pointer shadow-lg hover:bg-indigo-700 transition-all">
                <Camera size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">Profile Photo</p>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Bio</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-4 text-slate-400" size={18} />
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium h-24 resize-none"
                  placeholder="Write a short bio..."
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Skills</label>
              <div className="relative">
                <Wrench className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  placeholder="React, Tailwind, Node.js..."
                />
              </div>
              <p className="text-[10px] text-slate-400 ml-1 font-medium italic">Hint: use commas to separate skills</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={close}
              className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all text-sm flex items-center justify-center shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}