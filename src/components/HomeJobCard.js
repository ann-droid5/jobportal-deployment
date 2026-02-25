import "./HomeJobSection.css";

function HomeJobCard({ job }) {
  return (
    <div className="home-job-card">
      <div className="hiring-badge">📈 Actively hiring</div>

      <h5 className="job-title">{job.title}</h5>
      <p className="company-name">{job.company}</p>

      <div className="job-meta">
        <span><i className="bi bi-geo-alt"></i> {job.location}</span>
        <span><i className="bi bi-cash-stack"></i> {job.salary}</span>
      </div>

      <div className="job-card-footer">
        <span className="job-tag">Job</span>
        <span className="view-details">
          View details <span>›</span>
        </span>
      </div>
    </div>
  );
}

export default HomeJobCard;
