import { useNavigate } from "react-router-dom";

import "./JobCard.css";

function JobCard({ job, isApplied }) {
  const navigate = useNavigate();
  return (
    <div
      className="job-card"
      onClick={() => navigate(`/jobs/${job._id}`)}
      style={{ cursor: "pointer" }}
    >
      <h5 className="job-title">{job.title}</h5>
      <p className="company-name">{job.company}</p>

      <p className="job-meta">
        <i className="bi bi-geo-alt"></i> {job.location} | <i className="bi bi-briefcase"></i> {job.experience}
      </p>

      <p className="job-skills">
        Skills: {job.skills.join(", ")}
      </p>

      {isApplied ? (
        <span
          className="badge bg-success px-3 py-2"
          style={{ fontSize: "0.9rem" }}
        >
          Applied ✓
        </span>
      ) : (
        <button
          className="apply-btn text-decoration-none"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/jobs/${job._id}`);
          }}
        >
          Apply Now
        </button>
      )}
    </div>
  );
}

export default JobCard;
