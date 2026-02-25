import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

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
    <div className="container mt-4">
      <h3>Manage Users</h3>

      <div className="btn-group mt-3 mb-3">
        <button
          className={`btn btn-outline-primary ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Users
        </button>
        <button
          className={`btn btn-outline-warning ${filter === 'pending_employers' ? 'active' : ''}`}
          onClick={() => setFilter('pending_employers')}
        >
          Pending Employers
        </button>
        <button
          className={`btn btn-outline-success ${filter === 'verified_employers' ? 'active' : ''}`}
          onClick={() => setFilter('verified_employers')}
        >
          Verified Employers
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover mt-3 align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "40px", height: "40px" }}>
                      {user.firstName.charAt(0)}
                    </div>
                    <div>
                      <div className="fw-bold">{user.firstName} {user.lastName}</div>
                      <div className="text-muted small">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${user.role === 'employer' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                    {user.role}
                  </span>
                  {user.role === 'employer' && user.isVerified && (
                    <i className="bi bi-check-circle-fill text-success ms-1" title="Verified"></i>
                  )}
                </td>
                <td>
                  <span className={`badge bg-${user.status === 'Blocked' ? 'danger' : 'success'}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-sm btn-outline-${user.status === "Active" ? "danger" : "success"} me-2`}
                    onClick={() => handleStatusChange(user._id, user.status || "Active")}
                  >
                    {user.status === "Active" ? "Block" : "Activate"}
                  </button>

                  {user.role === 'employer' && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedUser(user)}
                    >
                      {user.isVerified ? "View Details" : "Verify Request"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verification Modal */}
      {selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedUser.isVerified ? "Company Details" : "Verify Employer Request"}
                </h5>
                <button className="btn-close" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Company Name:</strong> <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Email:</strong> <p>{selectedUser.email}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Website:</strong>
                    <p>
                      {selectedUser.companyDetails?.website ? (
                        <a href={selectedUser.companyDetails.website} target="_blank" rel="noreferrer">
                          {selectedUser.companyDetails.website}
                        </a>
                      ) : "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Location:</strong> <p>{selectedUser.companyDetails?.location || "N/A"}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Registration ID:</strong> <p className="text-primary fw-bold">{selectedUser.companyDetails?.registrationId || "N/A"}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Size:</strong> <p>{selectedUser.companyDetails?.size || "N/A"}</p>
                  </div>
                  <div className="col-12 mb-3">
                    <strong>Industry:</strong> <p>{selectedUser.companyDetails?.industry || "N/A"}</p>
                  </div>
                  <div className="col-12">
                    <strong>Description:</strong>
                    <p className="p-3 bg-light rounded">{selectedUser.companyDetails?.description || "No description provided."}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
                {!selectedUser.isVerified && (
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusChange(selectedUser._id, 'VERIFY_EMPLOYER')}
                  >
                    Approve & Verify
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
