import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./AdminPages.css";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get("/reports");
      setReports(res.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/reports/${id}/status`, { status: newStatus });
      setReports(reports.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Error updating report status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report permanently?")) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter(r => r._id !== id));
    } catch (error) {
      console.error("Failed to delete report:", error);
      alert("Error deleting report.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header-modern mb-4">
        <div>
          <h2><i className="bi bi-flag-fill me-3 text-danger"></i>User Reports & Feedback</h2>
          <p className="text-secondary mb-0">Review system issues, user feedback, and flagged content</p>
        </div>
      </div>

      <div className="admin-panel mb-5">
        <div className="admin-panel-header">
          <h5>Recent Reports</h5>
          <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={fetchReports}>
            <i className="bi bi-arrow-clockwise me-1"></i>Refresh
          </button>
        </div>
        <div className="admin-panel-body p-4">
          {loading ? (
            <div className="text-center py-5 text-muted">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="admin-empty-state">
              <i className="bi bi-check2-circle text-success opacity-50"></i>
              <h5 className="fw-bold text-dark">All clear!</h5>
              <p className="text-muted">There are zero pending reports. Great job keeping the platform clean.</p>
            </div>
          ) : (
            <div className="row g-3">
              {reports.map((r) => (
                <div key={r._id} className="col-12">
                  <div className="admin-list-item d-flex flex-wrap align-items-center">
                    <div className={`admin-list-item-icon ${r.status === 'Pending' ? 'bg-danger bg-opacity-10 text-danger' : r.status === 'Reviewed' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-success bg-opacity-10 text-success'} fs-5`}>
                      <i className={`bi ${r.status === 'Pending' ? 'bi-exclamation-triangle-fill' : r.status === 'Reviewed' ? 'bi-search' : 'bi-check-circle-fill'}`}></i>
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: "250px" }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fw-bold mb-0 text-dark">
                          {r.reportedBy ? `${r.reportedBy.firstName} ${r.reportedBy.lastName}` : "Unknown User"}
                          <span className="badge bg-secondary bg-opacity-25 text-dark ms-2 fw-normal">{r.entityType}</span>
                        </h6>
                        <small className="text-muted d-none d-sm-block">{formatDate(r.createdAt)}</small>
                      </div>
                      <p className="text-secondary mb-0">{r.issueInfo}</p>
                    </div>
                    <div className="ms-3 ms-md-4 d-flex align-items-center gap-2 mt-3 mt-md-0">
                      <select
                        className="form-select form-select-sm minimal-select"
                        value={r.status}
                        onChange={(e) => handleStatusUpdate(r._id, e.target.value)}
                        style={{ width: "130px" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      <button
                        className="btn btn-sm btn-outline-danger btn-action-glass delete p-2"
                        title="Delete Report"
                        onClick={() => handleDelete(r._id)}
                      >
                        <i className="bi bi-trash-fill m-0"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
