import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { Camera, Save, X, Tag, FileText, Layout } from "lucide-react";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/projects/${id}`);
      setTitle(data.title);
      setDescription(data.description);
      setTags(data.tags.join(", "));
      setImage(data.image);
      setPreview(data.image);
    } catch (err) {
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage(f);
    setPreview(URL.createObjectURL(f));
  };

  const saveChanges = async () => {
    if (!title.trim() || !description.trim()) {
      return toast.error("Title & description required");
    }

    try {
      setSaving(true);
      let imageURL = preview;

      if (image instanceof File) {
        const formData = new FormData();
        formData.append("file", image);
        const upload = await API.post("/upload/file", formData);
        imageURL = upload.data.url;
      }

      await API.put(`/projects/update/${id}`, {
        title,
        description,
        tags,
        image: imageURL,
      });

      toast.success("System Updated! ⚡");
      navigate(`/projects/${id}`);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-12 px-4 relative overflow-hidden">
      
      {/* BACKGROUND BLOBS */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Edit <span className="text-indigo-500">Project</span></h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Reconfiguring Metadata</p>
          </div>
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* BANNER UPLOAD SECTION */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10 rounded-3xl"></div>
            <img
              src={preview || "https://cdn-icons-png.flaticon.com/512/4211/4211763.png"}
              alt="banner"
              className="w-full h-72 object-cover rounded-[2.5rem] border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
            />
            <label className="absolute bottom-6 right-6 z-20 cursor-pointer group">
              <div className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl shadow-xl transition-all active:scale-95">
                <Camera size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Swap Visual</span>
              </div>
              <input type="file" className="hidden" onChange={handleFile} />
            </label>
          </div>

          {/* FORM FIELDS */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-6">
            
            {/* PROJECT TITLE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Project Designation</label>
              <div className="relative">
                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                <input
                  className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
                  placeholder="Designation..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Mission Intelligence</label>
              <div className="relative">
                <FileText className="absolute left-4 top-5 text-slate-600 w-4 h-4" />
                <textarea
                  rows="5"
                  className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 resize-none"
                  placeholder="Project details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* TAGS */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Technology Stack</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                <input
                  className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
                  placeholder="e.g. React, Node, AWS"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white border border-transparent hover:border-white/10 rounded-2xl transition-all"
              >
                Cancel Override
              </button>

              <button
                disabled={saving}
                onClick={saveChanges}
                className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <> Commit Changes <Save size={16} className="group-hover:scale-110 transition-transform" /> </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}