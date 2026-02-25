import { Link } from "react-router-dom";

function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3">
        <h3 className="mb-0 me-3">Employer Dashboard</h3>
        {user?.isVerified ? (
          <span className="badge bg-success rounded-pill d-flex align-items-center">
            <i className="bi bi-check-circle-fill me-1"></i> Verified
          </span>
        ) : (
          <span className="badge bg-warning text-dark rounded-pill d-flex align-items-center">
            <i className="bi bi-clock-fill me-1"></i> Pending Verification
          </span>
        )}
      </div>

      {!user?.isVerified && (
        <div className="alert alert-warning mt-3">
          <strong>Account Verification Pending</strong>
          <p className="mb-0">
            Please complete your company profile to get verified.
            {!user?.companyDetails ? (
              <Link to="/employer/onboarding" className="ms-2 btn btn-sm btn-primary">Complete Profile</Link>
            ) : (
              <span className="ms-2 badge bg-secondary">Pending Admin Approval</span>
            )}
          </p>
        </div>
      )}

      <div className="list-group mt-3">
        {user?.isVerified ? (
          <Link to="/employer/post-job" className="list-group-item list-group-item-action">
            Post a New Job
          </Link>
        ) : (
          <button className="list-group-item list-group-item-action disabled" disabled>
            Post a New Job (Requires Verification)
          </button>
        )}

        <Link to="/employer/manage-jobs" className="list-group-item list-group-item-action">
          Manage Posted Jobs
        </Link>

        <Link to="/employer/applicants" className="list-group-item list-group-item-action">
          View Applicants
        </Link>
      </div>
    </div>
  );
}

export default EmployerDashboard;
