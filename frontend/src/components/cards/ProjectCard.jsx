import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import ApplyModal from "../modals/ApplyModal";
import { Users, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

export default function ProjectCard({ project, refresh }) {
  const [openApply, setOpenApply] = useState(false);

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
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 24px 48px -12px rgba(99,102,241,0.3)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group bg-slate-800/50 border border-slate-700/50 rounded-[24px] overflow-hidden flex flex-col h-full backdrop-blur-sm hover:border-indigo-500/40 transition-colors duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <Link to={`/projects/${project._id}`}>
          {project.image ? (
            <motion.img
              src={project.image}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isFull ? "grayscale-[0.4]" : ""}`}
              alt={project.title}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-4xl">🚀</span>
            </div>
          )}
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isFull && (
            <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-500/30">
              Full House
            </span>
          )}
          {isOwner && (
            <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              Owner
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-3 mb-2">
          <Link to={`/projects/${project._id}`} className="flex-1">
            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
              {project.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <Users size={14} className="text-indigo-400" />
            <span className="text-xs font-bold text-slate-300">{currentTeamSize}/{maxTeamSize}</span>
          </div>
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/50 h-1.5 rounded-full mb-4 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isFull ? "bg-rose-500" : "bg-indigo-500"}`}
            initial={{ width: 0 }}
            animate={{ width: `${(currentTeamSize / maxTeamSize) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>

        {/* Owner & Tags */}
        <div className="mt-auto pt-4 border-t border-slate-700/40">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${project.owner?._id}`} className="flex items-center gap-2 group/owner">
              <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden ring-1 ring-slate-600">
                <img src={project.owner?.avatar || `https://ui-avatars.com/api/?name=${project.owner?.name}`} alt="" />
              </div>
              <span className="text-xs font-bold text-slate-400 group-hover/owner:text-indigo-400 transition-colors">
                {project.owner?.name?.split(" ")[0]}
              </span>
            </Link>

            <div className="flex gap-1">
              {project.tags?.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-tight">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          {!isOwner && !isMember && !isApplied && !isFull && (
            <motion.button
              onClick={handleApplyClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
            >
              Apply to Join <ArrowUpRight size={16} />
            </motion.button>
          )}

          {isApplied && !isMember && (
            <div className="w-full py-3 bg-amber-500/10 text-amber-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-amber-500/20">
              <Clock size={16} /> Application Pending
            </div>
          )}

          {isMember && !isOwner && (
            <div className="w-full py-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-emerald-500/20">
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
    </motion.div>
  );
}