import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "motion/react";
import ProtectedRoute from "./utils/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import { Toaster } from "sonner";
import Help from "./components/layout/Help";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const TechNewsFeed = lazy(() => import("./pages/Explore"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const EditProject = lazy(() => import("./pages/EditProject"));

// Loading Component with smooth animation
function LoadingScreen() {
  return (
    <motion.div 
      className="flex min-h-screen items-center justify-center bg-slate-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.p 
          className="text-slate-300 text-lg font-semibold"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Dev Hub…
        </motion.p>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" toastOptions={{ duration: 2400 }} />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* HOME */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Home />
              </ProtectedRoute>
            }
          />

          {/* NOTIFICATIONS */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Navbar />
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* EXPLORE */}
          <Route path="/explore" element={<TechNewsFeed />} />

          {/* PROJECTS LIST */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Navbar />
                <Projects />
              </ProtectedRoute>
            }
          />

          {/* HELP */}
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Navbar />
                <Help />
              </ProtectedRoute>
            }
          />

          {/* PROJECT DETAILS */}
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          {/* EDIT PROJECT */}
          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute>
                <Navbar />
                <EditProject />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
