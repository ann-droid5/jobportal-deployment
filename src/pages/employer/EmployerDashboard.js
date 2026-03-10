import { Link } from "react-router-dom";
import "./EmployerDashboard.css"; // Added CSS file

function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="employer-dashboard-container">
      <div className="dashboard-header-modern">
        <h3>Welcome, Employer</h3>
        {user?.isVerified ? (
          <span className="badge bg-success rounded-pill verification-status d-flex align-items-center">
            <i className="bi bi-check-circle-fill me-2"></i> Verified Company
          </span>
        ) : (
          <span className="badge bg-warning text-dark rounded-pill verification-status d-flex align-items-center">
            <i className="bi bi-shield-exclamation me-2"></i> Pending Verification
          </span>
        )}
      </div>

      {!user?.isVerified && (
        <div className="dashboard-alert-glass shadow-sm">
          <div className="dashboard-alert-content">
            <h4><i className="bi bi-info-circle-fill me-2"></i> Action Required</h4>
            <p>
              Please complete your company profile to get verified and unlock all features.
            </p>
          </div>
          <div>
            {!user?.companyDetails ? (
              <Link to="/employer/onboarding" className="btn btn-primary shadow-sm px-4 rounded-pill">
                Complete Profile
              </Link>
            ) : (
              <span className="badge bg-secondary px-3 py-2 rounded-pill">Pending Admin Approval</span>
            )}
          </div>
        </div>
      )}

      <div className="dashboard-cards-grid">
        {user?.isVerified ? (
          <Link to="/employer/post-job" className="dashboard-action-card">
            <div className="card-icon-wrapper">
              <i className="bi bi-plus-circle-fill"></i>
            </div>
            <h5>Post a New Job</h5>
            <p>Create and publish a new job opening for job seekers.</p>
          </Link>
        ) : (
          <div className="dashboard-action-card disabled-card">
            <div className="card-icon-wrapper">
              <i className="bi bi-lock-fill"></i>
            </div>
            <h5>Post a New Job</h5>
            <p className="text-danger mt-1 fw-bold">Requires Verification</p>
          </div>
        )}

        <Link to="/employer/manage-jobs" className="dashboard-action-card">
          <div className="card-icon-wrapper">
            <i className="bi bi-briefcase-fill"></i>
          </div>
          <h5>Manage Jobs</h5>
          <p>View, edit, or remove your actively posted job listings.</p>
        </Link>

        <Link to="/employer/applicants" className="dashboard-action-card">
          <div className="card-icon-wrapper">
            <i className="bi bi-people-fill"></i>
          </div>
          <h5>View Applicants</h5>
          <p>Review applications, download resumes, and short-list candidates.</p>
        </Link>
      </div>
    </div>
  );
}

export default EmployerDashboard;
