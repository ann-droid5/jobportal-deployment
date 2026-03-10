import { useNavigate } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job, isApplied }) {
  const navigate = useNavigate();

  // Format salary if exists
  const formatSalary = (salary) => {
    if (!salary) return "Not Disclosed";
    return salary;
  };

  // Safe checks for skills
  const displaySkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.slice(0, 3);
    if (typeof skills === 'string') return skills.split(',').slice(0, 3).map(s => s.trim());
    return [];
  };

  return (
    <div
      className="job-card-premium"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <div className={`job-card-badge ${isApplied ? 'badge-applied' : 'badge-new'}`}>
        {isApplied ? <><i className="bi bi-check-circle-fill me-1"></i>Applied</> : "New"}
      </div>

      <h5 className="job-card-title" title={job.title}>{job.title}</h5>

      <div className="job-card-company">
        <i className="bi bi-building"></i>
        <span>{job.company}</span>
      </div>

      <div className="job-card-meta">
        <div className="meta-item">
          <i className="bi bi-geo-alt-fill"></i>
          <span className="text-truncate" title={job.location}>{job.location}</span>
        </div>
        <div className="meta-item">
          <i className="bi bi-briefcase-fill"></i>
          <span className="text-truncate" title={job.experience}>{job.experience || "Entry Level"}</span>
        </div>
        <div className="meta-item">
          <i className="bi bi-cash-stack"></i>
          <span className="text-truncate" title={formatSalary(job.salary)}>{formatSalary(job.salary)}</span>
        </div>
        <div className="meta-item">
          <i className="bi bi-clock-history"></i>
          <span className="text-truncate">{job.type || "Full-time"}</span>
        </div>
      </div>

      <div className="job-card-skills">
        {displaySkills(job.skills).map((skill, index) => (
          <span key={index} className="job-skill-pill">{skill}</span>
        ))}
        {job.skills && (Array.isArray(job.skills) ? job.skills.length : job.skills.split(',').length) > 3 && (
          <span className="job-skill-pill bg-white border border-secondary text-secondary">
            +{(Array.isArray(job.skills) ? job.skills.length : job.skills.split(',').length) - 3}
          </span>
        )}
      </div>

      <div className="job-card-actions mt-auto">
        {isApplied ? (
          <button className="btn-card-applied w-100" disabled onClick={(e) => e.stopPropagation()}>
            <i className="bi bi-check2-all me-2"></i>Application Sent
          </button>
        ) : (
          <button
            className="btn-card-primary w-100"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/jobs/${job._id}`);
            }}
          >
            Apply Now <i className="bi bi-arrow-right ms-1"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default JobCard;
