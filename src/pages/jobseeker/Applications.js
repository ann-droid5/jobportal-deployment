import { useState, useEffect } from "react";
import api from "../../api/axios";
import ApplicationStatusBadge from "../../components/ApplicationStatusBadge";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          // Fetch applications for this user
          // Note: The backend should ideally populate 'job' and 'job.postedBy'
          const res = await api.get(`/applications/user/${user._id}`);
          setApplications(res.data);
        } catch (err) {
          console.error("Failed to fetch applications", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">My Applications</h2>

      {applications.length === 0 ? (
        <div className="text-center py-5 bg-light rounded border border-dashed">
          <i className="bi bi-briefcase fs-1 text-muted mb-3 d-block"></i>
          <h5 className="text-muted">You haven't applied to any jobs yet.</h5>
          <a href="/jobs" className="btn btn-primary mt-3">Browse Jobs</a>
        </div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 ps-4" style={{ minWidth: '250px' }}>Job Role</th>
                  <th className="py-3">Company</th>
                  <th className="py-3">Applied Date</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="transition-colors">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-briefcase-fill"></i>
                        </div>
                        <div>
                          <a href={`/jobs/${app.job?._id}`} className="fw-bold text-dark text-decoration-none hover-primary">
                            {app.job?.title}
                          </a>
                          <div className="small text-muted d-md-none">{app.job?.postedBy?.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-secondary fw-medium">
                      {app.job?.postedBy?.company || "Confidential"}
                    </td>
                    <td className="py-3 text-secondary">
                      {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3">
                      <ApplicationStatusBadge status={app.status || 'applied'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .table-hover tbody tr:hover {
            background-color: #f8f9fa;
        }
        .border-dashed {
            border-style: dashed !important;
        }
        .hover-primary:hover {
            color: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}

export default Applications;
