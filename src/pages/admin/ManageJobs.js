import { useState, useEffect } from "react";
import api from "../../api/axios";

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
    <div className="container mt-4">
      <h3>Manage Job Postings</h3>

      <table className="table mt-3">
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
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.postedBy?.company || "Unknown"}</td>
              <td>Active</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(job._id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageJobs;
