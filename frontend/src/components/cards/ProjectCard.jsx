import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ApplyModal from "../modals/ApplyModal";
import { Users, User, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

export default function ProjectCard({ project, refresh }) {
  const [openApply, setOpenApply] = useState(false);

  // User details from localStorage
  const authUser = JSON.parse(localStorage.getItem("user"));
  const authId = authUser?._id;

 
  const isOwner = authId === project.owner?._id;
  const isMember = project.team?.some((u) => u._id === authId);
  const isApplied = project.requests?.some((r) => r.user?._id === authId);
  const currentTeamSize = project.team?.length || 0;
  const maxTeamSize = project.teamSize || 1;
  const isFull = currentTeamSize >= maxTeamSize;

  const handleApplyClick = (e) => {
    e.preventDefault(); 
    if (isFull) return toast.error("This project is already full!");
    setOpenApply(true);
  };

  return (
    <div className="group bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden h-full">
      
      {/* 1. Thumbnail/Banner Section */}
      <div className="relative h-44 overflow-hidden">
        <Link to={`/projects/${project._id}`}>
          {project.image ? (
            <img
              src={project.image}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isFull ? 'grayscale-[0.5]' : ''}`}
              alt={project.title}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-4xl">🚀</span>
            </div>
          )}
        </Link>
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isFull && (
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              Full House
            </span>
          )}
          {isOwner && (
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              Owner
            </span>
          )}
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-3 mb-2">
          <Link to={`/projects/${project._id}`} className="flex-1">
            <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
              {project.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
            <Users size={14} className="text-indigo-500" />
            <span className="text-xs font-bold text-slate-700">{currentTeamSize}/{maxTeamSize}</span>
          </div>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mb-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${isFull ? 'bg-rose-500' : 'bg-indigo-500'}`}
            style={{ width: `${(currentTeamSize / maxTeamSize) * 100}%` }}
          ></div>
        </div>

        {/* Owner & Tags */}
        <div className="mt-auto pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${project.owner?._id}`} className="flex items-center gap-2 group/owner">
              <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                <img src={project.owner?.avatar || `https://ui-avatars.com/api/?name=${project.owner?.name}`} alt="" />
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover/owner:text-indigo-600 transition-colors">
                {project.owner?.name?.split(' ')[0]}
              </span>
            </Link>

            <div className="flex gap-1">
              {project.tags?.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          {!isOwner && !isMember && !isApplied && !isFull && (
            <button
              onClick={handleApplyClick}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
            >
              Apply to Join <ArrowUpRight size={16} />
            </button>
          )}

          {isApplied && !isMember && (
            <div className="w-full py-3 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-amber-100">
              <Clock size={16} /> Application Pending
            </div>
          )}

          {isMember && !isOwner && (
            <div className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-emerald-100">
              <CheckCircle2 size={16} /> You are a Member
            </div>
          )}
        </div>
      </div>

      {openApply && (
        <ApplyModal
          projectId={project._id}
          close={() => setOpenApply(false)}
          refresh={refresh}
        />
      )}
    </div>
  );
}