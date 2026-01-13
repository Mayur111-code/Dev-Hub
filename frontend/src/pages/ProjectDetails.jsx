import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../api/axios";
import { toast } from "react-toastify";
import timeAgo from "../utils/timeAgo";
import ApplyModal from "../components/modals/ApplyModal"; 
import { 
  Users, User, Calendar, Edit3, Trash2, CheckCircle2, 
  X, Plus, LayoutGrid, Info, MessageSquare, Shield, Check
} from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector((s) => s.user.user);
  const authId = authUser?._id || localStorage.getItem("userId");

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openApply, setOpenApply] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      toast.error("Failed to load project details");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  const deleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/projects/delete/${id}`);
      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      setProcessing(true);
      const { data } = await API.put(`/projects/accept/${id}/${requestId}`);
      toast.success("Member added! 🎉");
      setProject(data.project || data);
    } catch (err) {
      toast.error("Failed to accept request");
    } finally {
      setProcessing(false);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      setProcessing(true);
      const { data } = await API.put(`/projects/reject/${id}/${requestId}`);
      toast.info("Request rejected");
      setProject(data.project || data);
    } catch (err) {
      toast.error("Failed to reject");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 text-indigo-600 font-bold italic pt-20">Loading...</div>;
  if (!project) return <div className="h-screen flex items-center justify-center pt-20">Project Not Found</div>;

  const isOwner = authId === (project.owner?._id || project.owner);
  const isMember = project.team?.some(m => (m._id || m) === authId);
  const hasApplied = project.requests?.some(r => (r.user?._id || r.user) === authId);

  return (
   
    <div className="min-h-screen bg-[#F8FAFC] pb-12 pt-24"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Banner Image Area */}
        {project.image && (
          <div className="w-full h-48 md:h-64 rounded-[32px] overflow-hidden mb-8 shadow-md border border-slate-100">
            <img src={project.image} alt="Banner" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-slate-100">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.map((t, i) => (
                  <span key={i} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                    #{t}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">{project.title}</h1>
              
              <div className="prose prose-slate max-w-none">
                <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-2 uppercase text-xs tracking-tighter">
                  <Info size={16} className="text-indigo-500" /> About Project
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{project.description}</p>
              </div>
              
              {/* REQUESTS AREA */}
              {isOwner && project.requests?.filter(r => r.status === 'pending').length > 0 && (
                <div className="mt-10 pt-10 border-t border-slate-100">
                  <h3 className="text-xl font-bold text-rose-600 mb-6 flex items-center gap-2">
                    <MessageSquare size={20} /> New Applications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.requests.filter(r => r.status === 'pending').map(r => (
                      <div key={r._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="font-bold text-slate-800 mb-1">{r.user?.name}</p>
                        <p className="text-sm text-slate-500 italic mb-4">"{r.message}"</p>
                        <div className="flex gap-2">
                          <button 
                            disabled={processing}
                            onClick={() => acceptRequest(r._id)} 
                            className="flex-1 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-all active:scale-95"
                          >
                            Accept
                          </button>
                          <button 
                            disabled={processing}
                            onClick={() => rejectRequest(r._id)} 
                            className="flex-1 py-2 bg-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-300 transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Sidebar (Sticky Console) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-4 px-1 uppercase text-[10px] tracking-widest text-slate-400">Project Console</h3>
              
              <div className="space-y-3">
                {isOwner ? (
                  <>
                    <button 
                      onClick={() => navigate(`/projects/${project._id}/edit`)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                    >
                      <Edit3 size={18} /> Edit Details
                    </button>
                    <button 
                      onClick={deleteProject} 
                      className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
                    >
                      <Trash2 size={18} /> Remove Project
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    {isMember ? (
                       <div className="py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-center flex items-center justify-center gap-2 border border-emerald-100">
                         <CheckCircle2 size={18}/> Team Member
                       </div>
                    ) : hasApplied ? (
                      <div className="py-4 bg-amber-50 text-amber-600 rounded-2xl font-bold text-center flex items-center justify-center gap-2 border border-amber-100">
                        ⏳ Applied (Pending)
                      </div>
                    ) : (
                      <button 
                        onClick={() => setOpenApply(true)}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                      >
                        <Plus size={18} /> Join this Project
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Stats Area */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <p className="text-xl font-black text-slate-800">{project.team?.length || 0}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Members</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <p className="text-xl font-black text-slate-800">{project.requests?.length || 0}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Applications</p>
                  </div>
              </div>

              {/* Team List UI */}
              <div className="mt-8 pt-8 border-t border-slate-50">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400"><Shield size={14}/> Core Team</h3>
                <div className="space-y-4">
                  {project.team?.map(m => (
                    <div key={m._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          {m.avatar ? <img src={m.avatar} className="w-full h-full rounded-full object-cover" /> : m.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{m.name}</span>
                      </div>
                      {isOwner && m._id !== authId && (
                         <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">MEMBER</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openApply && (
        <ApplyModal 
          projectId={project._id} 
          close={() => setOpenApply(false)} 
          refresh={fetchProject} 
        />
      )}
    </div>
  );
}