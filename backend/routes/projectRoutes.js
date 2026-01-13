import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  applyToProject,
  acceptRequest,
  rejectRequest,
  removeMember
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ---------------------------
   CREATE PROJECT
---------------------------- */
router.post(
  "/create",
  authMiddleware,
  upload.single("file"),
  createProject
);

/* ---------------------------
   GET ALL PROJECTS
---------------------------- */
router.get(
  "/all",
  authMiddleware,
  getAllProjects
);

/* ---------------------------
   GET PROJECT DETAILS
---------------------------- */
router.get(
  "/:id",
  authMiddleware,
  getProjectById
);

/* ---------------------------
   UPDATE PROJECT
---------------------------- */
router.put(
  "/update/:id",
  authMiddleware,
  upload.single("file"),
  updateProject
);

/* ---------------------------
   DELETE PROJECT
---------------------------- */
router.delete(
  "/delete/:id",
  authMiddleware,
  deleteProject
);

/* ---------------------------
   APPLY TO PROJECT
---------------------------- */
router.post(
  "/apply/:id",
  authMiddleware,
  applyToProject
);

/* ---------------------------
   ACCEPT REQUEST
---------------------------- */
router.put(
  "/accept/:projectId/:requestId",
  authMiddleware,
  acceptRequest
);

/* ---------------------------
   REJECT REQUEST
---------------------------- */
router.put(
  "/reject/:projectId/:requestId",
  authMiddleware,
  rejectRequest
);

router.delete(
  "/remove-member/:projectId/:userId",
  authMiddleware,
  removeMember
);


export default router;
