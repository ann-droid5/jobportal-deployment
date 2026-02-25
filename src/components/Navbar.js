
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { courses } from "../data/courses";
import api from "../api/axios";

function Navbar({ role, setRole }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? `${user.firstName} ${user.lastName}` : "User";
  const userInitial = user ? user.firstName.charAt(0).toUpperCase() : "U";

  // Fetch Notifications on mount and periodically
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/notifications/${user._id}`);
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?._id]); // Depend on user ID

  const handleLogout = () => {
    localStorage.removeItem("user");
    setRole("guest");
    navigate("/");
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await api.patch(`/notifications/mark-all-read/${user._id}`);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark read");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Job Portal Logo" className="navbar-logo" /></Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/jobs">Jobs</Link>
            </li>
            {/* Job Seeker Links */}
            {role === "jobseeker" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/applications">Applications</Link>
                </li>
              </>
            )}

            {/* Employer Links */}
            {role === "employer" && (
              <li className="nav-item">
                <Link className="nav-link" to="/employer">Employer Dashboard</Link>
              </li>
            )}

            {/* Admin Links */}
            {role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
                <li><Link className="nav-link" to="/admin/users">Manage Users</Link></li>
                <li><Link className="nav-link" to="/admin/jobs">Manage Jobs</Link></li>
                <li><Link className="nav-link" to="/admin/reports">Reports</Link></li>

              </>

            )}



            {/* Courses - Only for Guest or Jobseeker */}
            {(role === 'guest' || role === 'jobseeker') && (
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Courses</Link>
                <ul className="dropdown-menu">
                  {courses.map(course => (
                    <li key={course.id}>
                      <Link className="dropdown-item" to={`/courses/${course.slug}`}>{course.title}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>


          <div className="nav-cta-container d-flex align-items-center gap-3">
            {role !== 'guest' ? (
              // LOGGED IN VIEW
              <>
                {/* Notification Bell */}
                <div className="dropdown">
                  <button
                    className="btn btn-light position-relative rounded-circle p-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={markAllAsRead}
                  >
                    <i className="bi bi-bell-fill fs-5 text-secondary"></i>
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                        <span className="visually-hidden">New alerts</span>
                      </span>
                    )}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end p-0 shadow" style={{ width: "300px", maxHeight: "400px", overflowY: "auto" }}>
                    <li className="p-2 border-bottom fw-bold bg-light d-flex justify-content-between">
                      <span>Notifications</span>
                      {unreadCount > 0 && <span className="badge bg-danger">{unreadCount} new</span>}
                    </li>
                    {notifications.length === 0 ? (
                      <li className="p-3 text-center text-muted small">No notifications</li>
                    ) : (
                      notifications.map(n => (
                        <li key={n._id} className={`p-2 border-bottom ${!n.isRead ? 'bg-light' : ''}`}>
                          <Link to={n.link || "#"} className="text-decoration-none text-dark d-block">
                            <div className="small">{n.message}</div>
                            <div className="text-muted" style={{ fontSize: "0.7rem" }}>{new Date(n.createdAt).toLocaleString()}</div>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* User Profile Dropdown */}
                <div className="dropdown">
                  <div
                    className="d-flex align-items-center cursor-pointer dropdown-toggle hide-arrow"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="me-2 text-end d-none d-md-block">
                      <div className="fw-bold small mb-0">{userName}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>{role}</div>
                    </div>
                    <div
                      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                      style={{ width: "40px", height: "40px", fontSize: "18px", fontWeight: "bold" }}
                    >
                      {userInitial}
                    </div>
                  </div>
                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    {role === 'jobseeker' && (
                      <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Edit Profile</Link></li>
                    )}
                    {role === 'employer' && (
                      <li><Link className="dropdown-item" to="/employer/onboarding"><i className="bi bi-building me-2"></i>Company Profile</Link></li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              // GUEST VIEW (Original)
              <>
                <form
                  className="search-form me-3"
                  role="search"
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate(`/jobs?search=${e.target.search.value}`);
                  }}
                >
                  <span className="search-icon"><i className="bi bi-search"></i></span>
                  <input
                    className="search-input"
                    type="search"
                    name="search"
                    placeholder="Search Jobs"
                    aria-label="Search"
                  />
                </form>
                
                <div className="header_vertical_partition"></div>
                <button type="button" className="btn login-btn" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
                <button
                  type="button"
                  className="btn login-btn"
                  onClick={() => navigate("/signup")}
                >
                  Register
                </button>
                <button
                  type="button"
                  className="btn login-btn"
                  onClick={() => navigate("/admin-login")}
                >
                  Admin Portal
                </button>
                <div className="header_vertical_partition"></div>
                <Link to="/employer/signup" className="employer-link">Employer sign up <span><i className="bi bi-chevron-right"></i></span></Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
