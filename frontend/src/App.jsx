import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function App() {
  return (
    <BrowserRouter>

      {/* GLOBAL TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        pauseOnHover={false}
        draggable
        theme="light"
      />

      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
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
