import Project from "../model/Project.js";
import Notification from "../model/Notification.js";

/* ===========================================================
   1) CREATE PROJECT 
   Supports: title, description, tags, banner (Cloudinary)
=========================================================== */
export const createProject = async (req, res) => {
  try {
    const { title, description, tags, postId, teamSize } = req.body;

    const bannerUrl = req.file ? req.file.path : null;

    const project = await Project.create({
      owner: req.user.id,
      title,
      description,
      tags: Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim()),
      image: bannerUrl,
      teamSize: Number(teamSize),   // now teamSize exists
      postId,
      team: [req.user.id]
    });

    return res.json({ message: "Project created", project });

  } catch (err) {
    console.error("Error creating project:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



/* ===========================================================
   2) GET ALL PROJECTS
=========================================================== */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name avatar")
      .populate("team", "name avatar skills")
      .sort({ createdAt: -1 });

    res.json(projects);

  } catch (err) {
    console.error("Error getting projects:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===========================================================
   3) GET PROJECT DETAILS BY ID
=========================================================== */

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name avatar")
      .populate("team", "name avatar skills")
      .populate("requests.user", "name avatar skills"); // ⭐ FIX

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);

  } catch (err) {
    console.error("Error getting project:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===========================================================
   4) UPDATE PROJECT (with optional new banner)
=========================================================== */
export const updateProject = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const bannerUrl = req.file ? req.file.path : project.image;

    project.title = title || project.title;
    project.description = description || project.description;
    project.tags = tags ? tags.split(",").map(t => t.trim()) : project.tags;
    project.image = bannerUrl;

    await project.save();

    return res.json({ message: "Project updated", project });

  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===========================================================
   5) DELETE PROJECT
=========================================================== */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await project.deleteOne();

    res.json({ message: "Project deleted" });

  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===========================================================
   6) APPLY TO A PROJECT  (FIXED - returns updated populated project)
=========================================================== */
export const applyToProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const { message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() === userId)
      return res.status(400).json({ message: "You cannot apply to your own project" });

    if (project.team.includes(userId))
      return res.status(400).json({ message: "Already a team member" });

    const already = project.requests.find(r => r.user.toString() === userId);
    if (already)
      return res.status(400).json({ message: "You already applied" });

    if (project.team.length >= project.teamSize) {
  return res.status(400).json({ message: "Project team is full" });
}

    // Push new request
    project.requests.push({
      user: userId,
      message,
      status: "pending"
    });

    await project.save();

    // Send notification to owner
    await Notification.create({
      user: project.owner,
      sender: userId,
      type: "collab_request",
      projectId
    });

    // ⭐ RETURN POPULATED PROJECT (important)
    const updated = await Project.findById(projectId)
      .populate("owner", "name avatar")
      .populate("team", "name avatar skills")
      .populate("requests.user", "name avatar skills");

    return res.json({
      message: "Applied successfully",
      project: updated
    });

  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



/* ===========================================================
   7) ACCEPT REQUEST
=========================================================== */
export const acceptRequest = async (req, res) => {
  try {
    const { projectId, requestId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const request = project.requests.id(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "accepted";

    if (!project.team.includes(request.user)) {
      project.team.push(request.user);
    }

    await project.save();

    // Notify the applicant
    await Notification.create({
      user: request.user,
      sender: req.user.id,
      type: "collab_accepted",
      projectId
    });

    res.json({ message: "Request accepted", project });

  } catch (err) {
    console.error("Accept error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===========================================================
   8) REJECT REQUEST
=========================================================== */
export const rejectRequest = async (req, res) => {
  try {
    const { projectId, requestId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const request = project.requests.id(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await project.save();

    res.json({ message: "Request rejected", project });

  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// REMOVE MEMBER FROM PROJECT
export const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only owner can remove members
    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    // Owner cannot remove himself
    if (project.owner.toString() === userId)
      return res.status(400).json({ message: "Owner cannot remove himself" });

    // Remove user
    project.team = project.team.filter(id => id.toString() !== userId);
    await project.save();

    // Notify removed user
    await Notification.create({
      user: userId,
      sender: req.user.id,
      type: "removed_from_project",
      projectId
    });

    res.json({ message: "Member removed", project });

  } catch (err) {
    console.error("Remove member error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
