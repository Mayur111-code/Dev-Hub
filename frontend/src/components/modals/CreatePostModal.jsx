import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../../api/axios";
import { X, Image as ImageIcon, Film, Loader2, Smile } from "lucide-react";
import { toast } from "react-toastify";

export default function CreatePostModal({ close, refresh }) {
  const { user } = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    if (preview) URL.revokeObjectURL(preview); 
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const createPost = async () => {
    if (!content.trim() && !file) return;
    
    try {
      setLoading(true);
      let fileUrl = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await API.post("/upload/file", formData);
        fileUrl = data.url;
      }

      await API.post("/posts/create", {
        content,
        image: file.type.startsWith("image/") ? fileUrl : null,
        video: file.type.startsWith("video/") ? fileUrl : null,
      });

      toast.success("Post shared successfully!");
      refresh();
      close();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Create Post</h2>
          <button onClick={close} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 px-6 pt-5">
          <img src={user?.avatar} className="w-10 h-10 rounded-full border border-slate-200" alt="me" />
          <div>
            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">Public</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6">
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-slate-700 text-lg placeholder:text-slate-400 outline-none resize-none min-h-[120px]"
            placeholder="Share your latest update..."
          />

          {/* Preview Card */}
          {preview && (
            <div className="relative mt-4 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              {file?.type.startsWith("video/") ? (
                <video src={preview} controls className="max-h-72 w-full object-contain" />
              ) : (
                <img src={preview} className="max-h-72 w-full object-contain" alt="preview" />
              )}
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-slate-900 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Action Tools */}
          <div className="mt-6 flex items-center justify-between border border-slate-200 rounded-xl px-4 py-2">
            <span className="text-sm font-medium text-slate-600">Add to your post</span>
            <div className="flex gap-1">
              <label className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors">
                <ImageIcon size={22} />
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
              <label className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors">
                <Film size={22} />
                <input type="file" accept="video/*" className="hidden" onChange={handleFile} />
              </label>
              <button className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                <Smile size={22} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={createPost}
            disabled={loading || (!content.trim() && !file)}
            className="w-full mt-5 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex justify-center items-center shadow-md shadow-indigo-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Post Now"}
          </button>
        </div>
      </div>
    </div>
  );
}