import express from "express";
import upload from "../middleware/upload.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

const router = express.Router();

// Allowed origins
const allowedOrigins = [
 "https://dev-hub-rust.vercel.app",
  "http://localhost:5173",
];

// CORS Middleware for this router
router.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
  })
);

// Fix OPTIONS preflight for file upload
router.options("/file", cors());

router.post("/file", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const buffer = req.file.buffer;

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "collab-project" },
    (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ error: "Upload failed" });
      }

      return res.json({ url: result.secure_url });
    }
  );

  uploadStream.end(buffer);
});

export default router;
