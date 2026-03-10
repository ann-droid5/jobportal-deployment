import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import "./AdminPages.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null); // For modal
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        addToast("error", "Failed to fetch users");
      }
    };
    fetchUsers();
  }, [addToast]);

  const handleStatusChange = async (id, action) => {
    try {
      if (action === 'VERIFY_EMPLOYER') {
        await api.put(`/users/${id}`, { isVerified: true });
        setUsers(users.map(u => u._id === id ? { ...u, isVerified: true } : u));
        addToast("success", "Employer Verified Successfully!");
        setSelectedUser(null); // Close modal
      } else {
        const newStatus = action === "Active" ? "Blocked" : "Active";
        await api.patch(`/users/${id}/status`, { status: newStatus });
        setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
        addToast("success", `User ${newStatus}`);
      }
    } catch (err) {
      addToast("error", "Failed to update status");
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === "all") return true;
    if (filter === "pending_employers") return user.role === "employer" && !user.isVerified;
    if (filter === "verified_employers") return user.role === "employer" && user.isVerified;
    return true;
  });

  return (
    <div className="admin-page-container">
      <div className="admin-header-modern">
        <div>
          <h2><i className="bi bi-people-fill me-3 text-primary"></i>Manage Users</h2>
          <p className="text-secondary mb-0">Control accounts, block users, and verify employers</p>
        </div>
      </div>

      <div className="admin-panel mt-4">
        <div className="admin-panel-header d-flex flex-wrap gap-2">
          <button
            className={`admin-filter-btn ${filter === 'all' ? 'btn btn-primary text-white shadow-sm' : 'btn text-secondary bg-light'}`}
            onClick={() => setFilter('all')}
          >
            All Users
          </button>
          <button
            className={`admin-filter-btn ${filter === 'pending_employers' ? 'btn btn-warning text-dark shadow-sm' : 'btn text-secondary bg-light'}`}
            onClick={() => setFilter('pending_employers')}
          >
            Pending Employers
          </button>
          <button
            className={`admin-filter-btn ${filter === 'verified_employers' ? 'btn btn-success text-white shadow-sm' : 'btn text-secondary bg-light'}`}
            onClick={() => setFilter('verified_employers')}
          >
            Verified Employers
          </button>
        </div>

        <div className="admin-panel-body p-4">
          <div className="table-responsive">
            {filteredUsers.length === 0 ? (
              <div className="admin-empty-state">
                <i className="bi bi-person-x"></i>
                <h5 className="fw-bold text-dark">No Users Found</h5>
                <p className="text-muted">No users match your current filter criteria.</p>
              </div>
            ) : (
              <table className="admin-table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="admin-table-row">
                      <td>
                        <div className="d-flex align-items-center">
                          <div className={`admin-avatar me-3 ${user.role === 'employer' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                            {user.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{user.firstName} {user.lastName}</div>
                            <div className="text-muted small"><i className="bi bi-envelope me-1"></i>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge px-3 py-2 rounded-pill ${user.role === 'employer' ? 'bg-info bg-opacity-10 text-info' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                          {user.role}
                        </span>
                        {user.role === 'employer' && user.isVerified && (
                          <i className="bi bi-check-circle-fill text-success ms-2 fs-5 align-middle" title="Verified"></i>
                        )}
                        {user.role === 'employer' && !user.isVerified && (
                          <i className="bi bi-exclamation-circle-fill text-warning ms-2 fs-5 align-middle" title="Pending Verification"></i>
                        )}
                      </td>
                      <td>
                        <span className={`badge px-3 py-2 rounded-pill ${user.status === 'Blocked' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'}`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className={`btn btn-sm fw-bold rounded-pill px-3 ${user.status === "Active" ? "btn-outline-danger" : "btn-outline-success"}`}
                            onClick={() => handleStatusChange(user._id, user.status || "Active")}
                          >
                            <i className={`bi ${user.status === "Active" ? "bi-lock-fill" : "bi-unlock-fill"} me-1`}></i>
                            {user.status === "Active" ? "Block" : "Activate"}
                          </button>

                          {user.role === 'employer' && (
                            <button
                              className="btn btn-sm btn-primary fw-bold rounded-pill shadow-sm px-3"
                              onClick={() => setSelectedUser(user)}
                            >
                              <i className="bi bi-building-check me-1"></i>
                              {user.isVerified ? "Company Details" : "Verify Request"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal styling updated */}
      {selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className={`modal-header border-0 pb-0 pt-4 px-4 ${selectedUser.isVerified ? 'bg-white' : 'bg-warning bg-opacity-10'}`}>
                <h4 className="modal-title fw-bold text-dark mb-2">
                  <i className={`bi ${selectedUser.isVerified ? 'bi-building text-primary' : 'bi-shield-exclamation text-warning'} me-2`}></i>
                  {selectedUser.isVerified ? "Registered Company Profile" : "Pending Employer Verification"}
                </h4>
                <button className="btn-close" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="modal-body p-4 pt-3">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold text-uppercase mb-1">Owner Name</label>
                    <div className="text-dark fw-bold fs-6">{selectedUser.firstName} {selectedUser.lastName}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold text-uppercase mb-1">Contact Email</label>
                    <div className="text-dark">{selectedUser.email}</div>
                  </div>

                  <div className="col-12"><hr className="text-muted opacity-25 m-0" /></div>

                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold text-uppercase mb-1">Company Website</label>
                    <div>
                      {selectedUser.companyDetails?.website ? (
                        <a href={selectedUser.companyDetails.website} target="_blank" rel="noreferrer" className="text-decoration-none fw-bold">
                          {selectedUser.companyDetails.website} <i className="bi bi-box-arrow-up-right small ms-1"></i>
                        </a>
                      ) : <span className="text-muted">Not provided</span>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold text-uppercase mb-1">HQ Location</label>
                    <div className="text-dark"><i className="bi bi-geo-alt-fill text-danger me-1"></i>{selectedUser.companyDetails?.location || "Not specified"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold text-uppercase mb-1">Registration ID</label>
                    <div className="font-monospace bg-light px-2 py-1 rounded d-inline-block text-dark border">{selectedUser.companyDetails?.registrationId || "Missing"}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small fw-semibold text-uppercase mb-1">Organization Size</label>
                    <div className="text-dark"><i className="bi bi-people-fill text-primary me-1"></i>{selectedUser.companyDetails?.size || "Not specified"}</div>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small fw-semibold text-uppercase mb-1">Industry / Sector</label>
                    <div className="text-dark"><span className="badge bg-secondary bg-opacity-25 text-dark px-2">{selectedUser.companyDetails?.industry || "Unspecified"}</span></div>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small fw-semibold text-uppercase mb-1">Company Description</label>
                    <div className="p-3 bg-light rounded text-dark border" style={{ minHeight: "80px" }}>
                      {selectedUser.companyDetails?.description || <span className="text-muted fst-italic">No description provided by the employer.</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => setSelectedUser(null)}>Close Window</button>
                {!selectedUser.isVerified && (
                  <button
                    className="btn btn-success rounded-pill px-4 fw-bold shadow-sm"
                    onClick={() => handleStatusChange(selectedUser._id, 'VERIFY_EMPLOYER')}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i> Approve & Verify Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
