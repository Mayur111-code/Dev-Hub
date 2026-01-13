import { useEffect, useState } from "react";
import API from "../api/axios";
import ProjectCard from "../components/cards/ProjectCard";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import { Plus, LayoutGrid, Rocket, Loader2, Filter } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-slate-500">
        <Loader2 className="animate-spin mb-4 text-indigo-600" size={40} />
        <p className="font-medium animate-pulse">Syncing projects...</p>
      </div>
    );

  return (
    <div className="pt-24 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
              Community Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore Projects
          </h1>
          <p className="text-slate-500 mt-2 max-w-md">
            Join innovative teams, contribute to open source, or start your own journey.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats Chips */}
          <div className="hidden lg:flex items-center gap-4 mr-4 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Total</p>
              <p className="text-lg font-bold text-slate-800">{projects.length}</p>
            </div>
            <div className="w-[1px] h-8 bg-slate-100"></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Active</p>
              <p className="text-lg font-bold text-emerald-600">
                {projects.filter(p => p.status !== 'completed').length}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:-translate-y-0.5"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* PROJECTS CONTENT */}
      {projects.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[32px] p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket className="text-slate-300" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">The stage is empty</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            Be the visionary who starts the first project in this community.
          </p>
          <button
            onClick={() => setOpenCreate(true)}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
          >
            Launch Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((p) => (
            <div key={p._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProjectCard project={p} refresh={loadProjects} />
            </div>
          ))}
        </div>
      )}

      {/* FOOTER STATS */}
      {projects.length > 0 && (
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="h-[1px] w-20 bg-slate-200"></div>
          <p className="text-slate-400 text-sm font-medium">
            End of discovery • {projects.length} projects found
          </p>
        </div>
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