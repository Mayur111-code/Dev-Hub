import { useEffect, useState } from "react";
import { motion } from "motion/react";
import API from "../api/axios";
import ProjectCard from "../components/cards/ProjectCard";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import { Plus, Rocket, Zap, Target } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  const loadProjects = async () => {
    try {
      const { data } = await API.get("/projects/all");
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-slate-950 to-slate-900">
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
          Syncing projects…
        </motion.p>
      </div>
    );

  const activeProjects = projects.filter(p => p.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-24 px-4 sm:px-6 max-w-7xl mx-auto pb-20">
      
      {/* HEADER SECTION */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.div 
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-500/30 flex items-center gap-1">
              <Zap size={12} /> Community Hub
            </span>
          </motion.div>
          <motion.h1 
            className="text-4xl sm:text-5xl font-black text-white tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Explore Projects
          </motion.h1>
          <motion.p 
            className="text-slate-400 mt-3 max-w-md text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join innovative teams, contribute to open source, or start your own journey.
          </motion.p>
        </div>

        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Stats Card */}
          <motion.div 
            className="hidden lg:flex items-center gap-4 px-6 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl"
            whileHover={{ borderColor: "rgba(99, 102, 241, 0.3)" }}
          >
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Total</p>
              <motion.p 
                className="text-2xl font-bold text-indigo-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {projects.length}
              </motion.p>
            </div>
            <div className="w-[1px] h-8 bg-slate-600"></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Active</p>
              <motion.p 
                className="text-2xl font-bold text-emerald-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {activeProjects}
              </motion.p>
            </div>
          </motion.div>

          <motion.button
            onClick={() => setOpenCreate(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all"
            whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>New Project</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* PROJECTS CONTENT */}
      {projects.length === 0 ? (
        <motion.div 
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-[32px] p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.div 
            className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Rocket className="text-slate-500" size={48} />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">The stage is empty</h3>
          <p className="text-slate-400 mb-8 max-w-xs mx-auto">
            Be the visionary who starts the first project in this community.
          </p>
          <motion.button
            onClick={() => setOpenCreate(true)}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Launch Project
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {projects.map((p, idx) => (
            <motion.div 
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProjectCard project={p} refresh={loadProjects} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* FOOTER STATS */}
      {projects.length > 0 && (
        <motion.div 
          className="mt-16 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="h-[1px] w-20 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
            animate={{ width: [80, 120, 80] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
            <Target size={16} /> End of discovery • {projects.length} {projects.length === 1 ? 'project' : 'projects'} found
          </p>
        </motion.div>
      )}

      {/* MODAL */}
      {openCreate && (
        <CreateProjectModal
          close={() => setOpenCreate(false)}
          refresh={loadProjects}
        />
      )}
    </div>
  );
}