import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from "react";
import { ToastProvider } from './context/ToastContext';
import CourseDetail from './pages/CourseDetail';
import TopRibbon from './components/TopRibbon';
import Navbar from './components/Navbar'
import LoginModal from './components/LoginModal'
// import RegisterModal from './components/RegisterModal'
// import EmployerRegisterModal from './components/EmployerRegisterModal'
import EmployerSignup from './pages/employer/EmployerSignup'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetails from "./pages/JobDetails";


import Profile from "./pages/jobseeker/Profile";
import Applications from "./pages/jobseeker/Applications";
import ResumeUpload from "./pages/jobseeker/ResumeUpload";
// Employer
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerOnboarding from "./pages/employer/EmployerOnboarding";
import PostJob from "./pages/employer/PostJob";
import ManageJobs from "./pages/employer/ManageJobs";
import Applicants from "./pages/employer/Applicants";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminJobs from "./pages/admin/ManageJobs";
import Reports from "./pages/admin/Reports";
import Signup from './pages/Signup';



function App() {
  // ROLE STATE (SIMULATED) => PERSISTED
  const [role, setRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.role : "guest";
  });
  // guest | jobseeker | employer | admin

  return (

    <ToastProvider>
      <BrowserRouter>
        <TopRibbon />
        <Navbar role={role} setRole={setRole} />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/signup" element={<Signup setRole={setRole} />} />
          <Route path="/employer/signup" element={<EmployerSignup setRole={setRole} />} />
          <Route path="/admin-login" element={<AdminLogin setRole={setRole} />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Job Seeker */}
          {role === "jobseeker" && (
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/resume" element={<ResumeUpload />} />
            </>
          )}

          {/* Employer */}
          {role === "employer" && (
            <>
              <Route path="/employer" element={<EmployerDashboard />} />
              <Route path="/employer/onboarding" element={<EmployerOnboarding />} />
              <Route path="/employer/post-job" element={<PostJob />} />
              <Route path="/employer/manage-jobs" element={<ManageJobs />} />
              <Route path="/employer/applicants" element={<Applicants />} />
            </>
          )}

          {/* Admin */}
          {role === "admin" && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/jobs" element={<AdminJobs />} />
              <Route path="/admin/reports" element={<Reports />} />
            </>
          )}

          {/* Dynamic Course Route */}
          <Route path="/courses/:slug" element={<CourseDetail />} />

        </Routes>

        {/* GLOBAL MODALS */}
        <LoginModal setRole={setRole} />
        {/* <RegisterModal setRole={setRole} /> */}
        {/* <EmployerRegisterModal setRole={setRole} /> */}
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;