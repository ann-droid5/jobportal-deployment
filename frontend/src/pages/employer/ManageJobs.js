import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./EmployerPages.css";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          const res = await api.get(`/jobs/employer/${user._id}`);
          setJobs(res.data);
        } catch (err) {
          console.error("Failed to fetch jobs");
        }
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
    <div className="employer-page-container">
      <div className="page-header-modern">
        <h3><i className="bi bi-briefcase-fill me-3 text-primary"></i>Manage Jobs</h3>
      </div>

      <div className="table-glass-card">
        {jobs.length === 0 ? (
          <div className="empty-state-card">
            <i className="bi bi-inbox"></i>
            <h4>No Jobs Posted Yet</h4>
            <p>Start posting jobs to see them listed here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table align-middle">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="modern-table-row">
                    <td>
                      <div className="job-title-highlight">{job.title}</div>
                      <div className="text-muted small"><i className="bi bi-geo-alt-fill me-1"></i>{job.location || 'Remote'}</div>
                    </td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Active</span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn-action-glass edit">
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                          className="btn-action-glass delete"
                          onClick={() => handleDelete(job._id)}
                        >
                          <i className="bi bi-trash-fill"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageJobs;
