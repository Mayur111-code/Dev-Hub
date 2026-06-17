import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import API from "../api/axios";
import { toast } from "sonner";
import Navbar from "../components/layout/Navbar";
import timeAgo from "../utils/timeAgo";
import ApplyModal from "../components/modals/ApplyModal";
import {
  Users, Edit3, Trash2, CheckCircle2,
  Plus, Info, MessageSquare, Shield, ArrowLeft
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
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      setProcessing(true);
      const { data } = await API.put(`/projects/accept/${id}/${requestId}`);
      toast.success("Member added! 🎉");
      setProject(data.project || data);
    } catch {
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
    } catch {
      toast.error("Failed to reject");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center">
        <Navbar />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"
        />
        <motion.p
          className="text-slate-400 font-semibold"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading project…
        </motion.p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <Navbar />
        <div className="text-slate-400 font-bold text-xl">Project Not Found</div>
      </div>
    );
  }

  const isOwner = authId === (project.owner?._id || project.owner);
  const isMember = project.team?.some((m) => (m._id || m) === authId);
  const hasApplied = project.requests?.some((r) => (r.user?._id || r.user) === authId);
  const currentTeamSize = project.team?.length || 0;
  const maxTeamSize = project.teamSize || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* Back button */}
        <motion.button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold mb-8 transition-colors group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </motion.button>

        {/* Banner */}
        {project.image && (
          <motion.div
            className="w-full h-52 md:h-72 rounded-3xl overflow-hidden mb-8 border border-slate-700/50 shadow-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img src={project.image} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Main Content */}
          <motion.div
            className="lg:col-span-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-slate-800/50 border border-slate-700/50 p-7 md:p-10 rounded-3xl backdrop-blur-sm">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags?.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                {project.title}
              </h1>

              <div>
                <h3 className="flex items-center gap-2 text-slate-400 font-bold mb-3 uppercase text-xs tracking-widest">
                  <Info size={16} className="text-indigo-400" /> About Project
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Applications (Owner only) */}
              {isOwner && project.requests?.filter((r) => r.status === "pending").length > 0 && (
                <motion.div
                  className="mt-10 pt-10 border-t border-slate-700/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <MessageSquare size={20} className="text-indigo-400" /> New Applications
                    <span className="ml-2 px-2.5 py-0.5 bg-rose-500/20 text-rose-300 text-xs font-black rounded-full border border-rose-500/20">
                      {project.requests.filter((r) => r.status === "pending").length}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.requests
                      .filter((r) => r.status === "pending")
                      .map((r) => (
                        <motion.div
                          key={r._id}
                          className="p-5 bg-slate-700/30 border border-slate-600/40 rounded-2xl"
                          whileHover={{ borderColor: "rgba(99,102,241,0.4)" }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={r.user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-600/50"
                              alt=""
                            />
                            <p className="font-bold text-white text-sm">{r.user?.name}</p>
                          </div>
                          <p className="text-sm text-slate-400 italic mb-4 line-clamp-2">
                            "{r.message}"
                          </p>
                          <div className="flex gap-2">
                            <motion.button
                              disabled={processing}
                              onClick={() => acceptRequest(r._id)}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
                            >
                              Accept
                            </motion.button>
                            <motion.button
                              disabled={processing}
                              onClick={() => rejectRequest(r._id)}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 py-2.5 bg-slate-600/30 border border-slate-600/40 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-600 hover:text-white transition-all"
                            >
                              Reject
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* RIGHT: Sidebar Console */}
          <motion.div
            className="lg:col-span-4 space-y-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm sticky top-24">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-5">
                Project Console
              </p>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Team Capacity</span>
                  <span className="font-bold text-white">{currentTeamSize}/{maxTeamSize}</span>
                </div>
                <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${currentTeamSize >= maxTeamSize ? "bg-rose-500" : "bg-indigo-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((currentTeamSize / maxTeamSize) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwner ? (
                  <>
                    <motion.button
                      onClick={() => navigate(`/projects/${project._id}/edit`)}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
                    >
                      <Edit3 size={17} /> Edit Details
                    </motion.button>
                    <motion.button
                      onClick={deleteProject}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
                    >
                      <Trash2 size={17} /> Remove Project
                    </motion.button>
                  </>
                ) : (
                  <>
                    {isMember ? (
                      <div className="py-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                        <CheckCircle2 size={17} /> Team Member
                      </div>
                    ) : hasApplied ? (
                      <div className="py-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl font-bold text-center">
                        ⏳ Applied (Pending)
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => setOpenApply(true)}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                      >
                        <Plus size={17} /> Join this Project
                      </motion.button>
                    )}
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-2xl text-center">
                  <p className="text-2xl font-black text-white">{currentTeamSize}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Members</p>
                </div>
                <div className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-2xl text-center">
                  <p className="text-2xl font-black text-white">{project.requests?.length || 0}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Applications</p>
                </div>
              </div>

              {/* Team list */}
              {project.team?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700/40">
                  <h3 className="font-bold text-slate-400 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                    <Shield size={14} /> Core Team
                  </h3>
                  <div className="space-y-3">
                    {project.team.map((m) => (
                      <div key={m._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/20 overflow-hidden flex items-center justify-center text-xs font-bold text-indigo-400">
                            {m.avatar ? (
                              <img src={m.avatar} className="w-full h-full object-cover" alt="" />
                            ) : (
                              m.name?.charAt(0)
                            )}
                          </div>
                          <span className="text-sm font-bold text-slate-300">{m.name}</span>
                        </div>
                        {m._id === (project.owner?._id || project.owner) && (
                          <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg">
                            OWNER
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

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