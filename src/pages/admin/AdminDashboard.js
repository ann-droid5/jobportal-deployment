import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Admin Dashboard</h2>
          <p className="text-muted">Overview of platform performance</p>
        </div>
        <div className="text-end">
          <span className="badge bg-primary fs-6">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "5px solid #0d6efd" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <h3 className="fw-bold mb-0">{stats.users}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/admin/users" className="text-decoration-none text-primary small fw-bold">Manage Users &rarr;</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "5px solid #198754" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Jobs</h6>
                  <h3 className="fw-bold mb-0">{stats.jobs}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                  <i className="bi bi-briefcase-fill fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/admin/jobs" className="text-decoration-none text-success small fw-bold">Manage Jobs &rarr;</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderLeft: "5px solid #ffc107" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Applications</h6>
                  <h3 className="fw-bold mb-0">{stats.applications}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                  <i className="bi bi-file-earmark-text-fill fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/admin/reports" className="text-decoration-none text-warning small fw-bold">View Reports &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Recent Section (Placeholder) */}
      <div className="row mt-5">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Recent Platform Activity</h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5 text-muted">
                <i className="bi bi-activity fs-1 mb-3 d-block"></i>
                <p>No recent activity logs available.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm bg-dark text-white">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Admin Actions</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/admin/users" className="text-white-50 text-decoration-none hover-white">Verify New Employers</Link></li>
                <li className="mb-2"><Link to="/admin/jobs" className="text-white-50 text-decoration-none hover-white">Review Flagged Jobs</Link></li>
                <li className="mb-2"><Link to="/admin/reports" className="text-white-50 text-decoration-none hover-white">Generate Weekly Report</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;
