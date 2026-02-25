import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    education: [], // Array of objects
    experience: "",
    skills: "",
    resume: "" // Path string
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      try {
        const res = await api.get(`/users/${user._id}`);
        // Ensure education is an array
        const data = res.data;
        if (!Array.isArray(data.education)) {
          data.education = [];
        }
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile");
      }
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle Education Change
  const handleEducationChange = (index, field, value) => {
    const newEdu = [...profile.education];
    newEdu[index][field] = value;
    setProfile({ ...profile, education: newEdu });
  };

  const addEducation = () => {
    setProfile({ ...profile, education: [...profile.education, { level: "", institution: "", year: "" }] });
  };

  const removeEducation = (index) => {
    const newEdu = profile.education.filter((_, i) => i !== index);
    setProfile({ ...profile, education: newEdu });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();
    formData.append("firstName", profile.firstName);
    formData.append("lastName", profile.lastName);
    formData.append("phone", profile.phone);
    formData.append("experience", profile.experience);
    formData.append("skills", profile.skills);
    // Send education as JSON string
    formData.append("education", JSON.stringify(profile.education));

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      // Use standard axios for multipart
      await api.put(`/users/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile(); // Refresh to get new resume path
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };

  // Profile completeness calculation
  // Simplified for now
  const completionPercent = 50; // Placeholder logic or re-implement later

  return (
    <div className="container mt-4 profile-page pb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Profile</h3>
        {!isEditing && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Completeness */}
      <div className="card mb-4 profile-meter">
        <div className="card-body">
          <p className="mb-1 fw-semibold">
            Profile completeness: {completionPercent}%
          </p>
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {isEditing ? (
        // EDIT MODE FORM
        <form onSubmit={handleSubmit}>
          {/* Basic Details */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="section-title">Basic Details</h5>

              <div className="row">
                <div className="col-md-3 mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled // Email shouldn't be editable easily
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="section-title">Education</h5>
              {profile.education.map((edu, index) => (
                <div key={index} className="mb-3 border-bottom pb-3">
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input
                        type="text" className="form-control" placeholder="Level (e.g. B.Tech)"
                        value={edu.level} onChange={(e) => handleEducationChange(index, "level", e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text" className="form-control" placeholder="Institution"
                        value={edu.institution} onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text" className="form-control" placeholder="Year"
                        value={edu.year} onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                      />
                    </div>
                    <div className="col-md-1">
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeEducation(index)}>X</button>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={addEducation}>+ Add Education</button>
            </div>
          </div>

          {/* Experience */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="section-title">Experience</h5>
              <input
                type="text"
                className="form-control"
                name="experience"
                placeholder="Fresher / 0–2 years"
                value={profile.experience}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="section-title">Skills</h5>
              <input
                type="text"
                className="form-control"
                name="skills"
                placeholder="React, JavaScript, SQL"
                value={profile.skills}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="section-title">Resume</h5>
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
              <div className="form-text">Upload a new resume (PDF) to update. Max 5MB.</div>
              {profile.resume && (
                <div className="mt-2">
                  <small>Current Resume: </small>
                  <a href={`http://localhost:5000${profile.resume}`} target="_blank" rel="noopener noreferrer">View Saved Resume</a>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary px-4">
              Save / Update Profile
            </button>
            <button
              type="button"
              className="btn btn-secondary px-4"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // VIEW MODE
        <div className="view-profile">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title text-primary mb-3">Basic Details</h5>
              <div className="row">
                <div className="col-md-4">
                  <strong>Name:</strong> <p>{`${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "N/A"}</p>
                </div>
                <div className="col-md-4">
                  <strong>Email:</strong> <p>{profile.email}</p>
                </div>
                <div className="col-md-4">
                  <strong>Phone:</strong> <p>{profile.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title text-primary mb-3">Professional Skills</h5>
              <div className="mb-3">
                <strong>Education:</strong>
                {profile.education && profile.education.length > 0 ? (
                  <ul className="mt-2">
                    {profile.education.map((edu, i) => (
                      <li key={i}>{edu.level} from {edu.institution} ({edu.year})</li>
                    ))}
                  </ul>
                ) : <p>N/A</p>}
              </div>
              <div className="mb-3">
                <strong>Experience:</strong> <p>{profile.experience || "N/A"}</p>
              </div>
              <div>
                <strong>Skills:</strong> <p>{profile.skills || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title text-primary mb-3">Resume</h5>
              {profile.resume ? (
                <a href={`http://localhost:5000${profile.resume}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                  View Saved Resume
                </a>
              ) : (
                <p className="text-muted">No resume uploaded</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
