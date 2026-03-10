import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./EmployerPages.css";

function Applicants() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // Fetch Employer's Jobs first
    const fetchJobs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await api.get(`/jobs`); // This returns ALL jobs. We need to filter for this employer or have a specific endpoint.
        // Assuming /jobs returns all, we filter client side for now or fix endpoint.
        // Ideally: GET /jobs?postedBy=ID
        const myJobs = res.data.filter(job => job.postedBy === user._id || job.postedBy?._id === user._id);
        setJobs(myJobs);
        if (myJobs.length > 0) setSelectedJobId(myJobs[0]._id);
      } catch (err) {
        console.error("Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;

    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/applications/job/${selectedJobId}`);
        setApplicants(res.data);
      } catch (err) {
        console.error("Failed to fetch applicants");
      }
    };
    fetchApplicants();
  }, [selectedJobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplicants(applicants.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      // Notification is handled by backend
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Rejected': return 'bg-danger bg-opacity-10 text-danger';
      case 'Hired': return 'bg-success bg-opacity-10 text-success';
      case 'Shortlisted': return 'bg-primary bg-opacity-10 text-primary';
      case 'Interview Scheduled': return 'bg-warning bg-opacity-10 text-warning';
      case 'Viewed': return 'bg-info bg-opacity-10 text-info';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  return (
    <div className="employer-page-container">
      <div className="page-header-modern">
        <h3><i className="bi bi-people-fill me-3 text-primary"></i>Applicants</h3>
      </div>

      <div className="job-select-wrapper">
        <label className="form-label fw-bold text-secondary mb-2">Select Job Listing:</label>
        <select
          className="form-select minimal-select"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          {jobs.map(job => (
            <option key={job._id} value={job._id}>{job.title}</option>
          ))}
          {jobs.length === 0 && <option>No jobs available</option>}
        </select>
      </div>

      <div className="table-glass-card">
        {applicants.length === 0 ? (
          <div className="empty-state-card">
            <i className="bi bi-person-x"></i>
            <h4>No Applicants Found</h4>
            <p>No one has applied to this job listing yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table align-middle">
              <thead>
                <tr>
                  <th>Applicant Profile</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th>Cover Message</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a) => (
                  <tr key={a._id} className="modern-table-row">
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px", fontWeight: "bold", fontSize: "1.2rem" }}>
                          {a.applicant.firstName.charAt(0)}{a.applicant.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="job-title-highlight fs-6 m-0">{a.applicant.firstName} {a.applicant.lastName}</div>
                          <div className="text-muted small"><i className="bi bi-envelope me-1"></i>{a.applicant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge px-3 py-2 rounded-pill ${getStatusBadge(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      {a.resume ? (
                        <a
                          href={a.resume.startsWith("http") ? a.resume : `http://localhost:5000${a.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-action-glass edit text-decoration-none"
                        >
                          <i className="bi bi-file-earmark-pdf-fill"></i> View
                        </a>
                      ) : (
                        <span className="badge bg-light text-dark border">N/A</span>
                      )}
                    </td>
                    <td>
                      <div className="small text-muted" style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={a.message}>
                        {a.message || "No message provided"}
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-select minimal-select form-select-sm"
                        value={a.status}
                        onChange={(e) => handleStatusChange(a._id, e.target.value)}
                      >
                        <option>Applied</option>
                        <option>Viewed</option>
                        <option>Shortlisted</option>
                        <option>Interview Scheduled</option>
                        <option>Hired</option>
                        <option>Rejected</option>
                      </select>
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

export default Applicants;
