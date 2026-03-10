import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "./AdminPages.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, jobsRes, appsRes] = await Promise.all([
          api.get("/users"),
          api.get("/jobs"),
          api.get("/applications")
        ]);

        setStats({
          users: usersRes.data.length,
          jobs: jobsRes.data.length,
          applications: appsRes.data.length
        });
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-header-modern">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="text-secondary mb-0">Platform performance & management overview</p>
        </div>
        <div className="text-end d-none d-md-block">
          <div className="bg-white px-4 py-2 rounded-pill shadow-sm border text-primary fw-bold d-flex align-items-center">
            <i className="bi bi-calendar-check me-2"></i> {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <Link to="/admin/users" className="text-decoration-none text-dark">
            <div className="admin-stat-card border-primary border-opacity-25" style={{ borderTop: "4px solid #0d6efd" }}>
              <div className="stat-content">
                <h6 className="text-primary">Total Users</h6>
                <h3 className="text-dark">{stats.users}</h3>
              </div>
              <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/admin/jobs" className="text-decoration-none text-dark">
            <div className="admin-stat-card border-success border-opacity-25" style={{ borderTop: "4px solid #198754" }}>
              <div className="stat-content">
                <h6 className="text-success">Total Jobs</h6>
                <h3 className="text-dark">{stats.jobs}</h3>
              </div>
              <div className="stat-icon bg-success bg-opacity-10 text-success">
                <i className="bi bi-briefcase-fill"></i>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/admin/reports" className="text-decoration-none text-dark">
            <div className="admin-stat-card border-warning border-opacity-50" style={{ borderTop: "4px solid #ffc107" }}>
              <div className="stat-content">
                <h6 className="text-warning text-darken">Applications</h6>
                <h3 className="text-dark">{stats.applications}</h3>
              </div>
              <div className="stat-icon bg-warning bg-opacity-25 text-warning" style={{ color: '#d39e00' }}>
                <i className="bi bi-file-earmark-text-fill"></i>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Quick Actions Panel */}
        <div className="col-lg-5">
          <div className="admin-panel mb-4">
            <div className="admin-panel-header">
              <h5><i className="bi bi-lightning-charge-fill text-warning me-2"></i> Quick Actions</h5>
            </div>
            <div className="admin-panel-body p-0">
              <div className="p-3">
                <Link to="/admin/users" className="admin-list-item text-decoration-none text-dark">
                  <div className="admin-list-item-icon bg-info bg-opacity-10 text-info">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Verify Employers</h6>
                    <small className="text-muted">Review pending company profiles</small>
                  </div>
                  <i className="bi bi-chevron-right ms-auto text-muted"></i>
                </Link>

                <Link to="/admin/jobs" className="admin-list-item text-decoration-none text-dark">
                  <div className="admin-list-item-icon bg-success bg-opacity-10 text-success">
                    <i className="bi bi-search"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Monitor Jobs</h6>
                    <small className="text-muted">Check recently posted listings</small>
                  </div>
                  <i className="bi bi-chevron-right ms-auto text-muted"></i>
                </Link>

                <Link to="/admin/reports" className="admin-list-item text-decoration-none text-dark">
                  <div className="admin-list-item-icon bg-danger bg-opacity-10 text-danger">
                    <i className="bi bi-flag-fill"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">View Reports</h6>
                    <small className="text-muted">User feedback and flagged content</small>
                  </div>
                  <i className="bi bi-chevron-right ms-auto text-muted"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* System Activity Panel */}
        <div className="col-lg-7">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h5><i className="bi bi-activity text-primary me-2"></i> System Activity Overview</h5>
            </div>
            <div className="admin-panel-body">
              <div className="admin-empty-state">
                <i className="bi bi-graph-up-arrow text-primary opacity-50"></i>
                <h5 className="fw-bold text-dark">Activity Logs</h5>
                <p className="text-muted">Analytics and detailed activity logs will appear here once monitoring is enabled.</p>
                <button className="btn btn-outline-primary rounded-pill px-4 mt-2">
                  <i className="bi bi-arrow-clockwise me-2"></i>Refresh Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
