import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./AdminPages.css";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header-modern">
        <div>
          <h2><i className="bi bi-briefcase-fill me-3 text-primary"></i>Manage Job Postings</h2>
          <p className="text-secondary mb-0">Review and moderate all jobs on the platform</p>
        </div>
      </div>

      <div className="admin-panel mt-4">
        <div className="admin-panel-body p-4">
          {jobs.length === 0 ? (
            <div className="admin-empty-state">
              <i className="bi bi-inbox"></i>
              <h5 className="fw-bold text-dark">No Jobs Discovered</h5>
              <p className="text-muted">There are currently no active job postings available.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table align-middle">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id} className="admin-table-row">
                      <td>
                        <div className="fw-bold text-dark">{job.title}</div>
                        <div className="text-muted small"><i className="bi bi-geo-alt-fill me-1"></i>{job.location || 'Location missing'}</div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-building text-secondary me-2"></i>
                          <span className="fw-semibold">{job.postedBy?.company || "Unknown Company"}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Active</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger fw-bold rounded-pill px-3"
                          onClick={() => handleDelete(job._id)}
                        >
                          <i className="bi bi-trash3-fill me-1"></i> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageJobs;
