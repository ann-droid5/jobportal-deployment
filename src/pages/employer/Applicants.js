import { useState, useEffect } from "react";
import api from "../../api/axios";
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

  return (
    <div className="container mt-4">
      <h3>Applicants</h3>

      <div className="mb-3">
        <label className="form-label">Select Job:</label>
        <select
          className="form-select"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          {jobs.map(job => (
            <option key={job._id} value={job._id}>{job.title}</option>
          ))}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-hover mt-3 align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Resume</th>
              <th>Cover Message</th>
              <th>Update Status</th>
            </tr>
          </thead>

          <tbody>
            {applicants.length === 0 ? (
              <tr><td colSpan="5" className="text-center">No applicants found for this job.</td></tr>
            ) : (
              applicants.map((a) => (
                <tr key={a._id}>
                  <td>
                    <div className="fw-bold">{a.applicant.firstName} {a.applicant.lastName}</div>
                    <div className="text-muted small">{a.applicant.email}</div>
                  </td>
                  <td>
                    <span className={`badge bg-${a.status === 'Rejected' ? 'danger' : a.status === 'Hired' ? 'success' : 'info'}`}>
                      {a.status}
                    </span>
                  </td>

                  {/* RESUME ACTIONS */}
                  <td>
                    {a.resume ? (
                      <a
                        href={a.resume.startsWith("http") ? a.resume : `http://localhost:5000${a.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-muted small">N/A</span>
                    )}
                  </td>

                  <td>
                    <div className="small text-muted" style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={a.message}>
                      {a.message || "No message"}
                    </div>
                  </td>

                  {/* STATUS UPDATE */}
                  <td>
                    <select
                      className="form-select form-select-sm"
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Applicants;
