import "./ApplicationStatusBadge.css";

function ApplicationStatusBadge({ status }) {
  return (
    <span className={`status-badge ${status.toLowerCase().replace(" ", "-")}`}>
      {status}
    </span>
  );
}

export default ApplicationStatusBadge;
