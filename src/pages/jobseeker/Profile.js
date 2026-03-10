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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

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
      const res = await api.put(`/users/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Profile updated successfully!");

      // Update local storage so other pages (like Jobs recommendations) get fresh data
      localStorage.setItem("user", JSON.stringify(res.data));

      setIsEditing(false);
      fetchProfile(); // Refresh to get new resume path
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate generic profile completeness
  const calculateCompleteness = () => {
    let score = 0;
    if (profile.firstName) score += 15;
    if (profile.lastName) score += 15;
    if (profile.phone) score += 15;
    if (profile.education.length > 0) score += 20;
    if (profile.experience) score += 15;
    if (profile.skills) score += 10;
    if (profile.resume) score += 10;
    return score;
  };
  const completionPercent = calculateCompleteness();

  return (
    <div className="container mt-5 profile-page pb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="profile-header-title">
              <i className="bi bi-person-badge text-primary me-2"></i>My Profile
            </h2>
            {!isEditing && (
              <button
                className="btn-primary-custom"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil-square me-2"></i>Edit Profile
              </button>
            )}
          </div>

          {/* Profile Completeness Meter */}
          <div className="meter-card mb-5">
            <div className="d-flex justify-content-between align-items-end">
              <div>
                <h5 className="mb-1 fw-bold">Profile Strength</h5>
                <p className="mb-0 text-white-50 small">Complete your profile to stand out to employers.</p>
              </div>
              <h4 className="mb-0 fw-bold">{completionPercent}%</h4>
            </div>
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
          </div>

          {isEditing ? (
            /* ================= EDIT MODE FORM ================= */
            <form onSubmit={handleSubmit} className="profile-edit-mode">

              {/* Basic Details */}
              <div className="profile-card mb-4">
                <h5 className="profile-card-title"><i className="bi bi-person-lines-fill"></i> Personal Information</h5>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label-custom">First Name</label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-person"></i></span>
                      <input
                        type="text" className="form-control form-control-custom" name="firstName"
                        value={profile.firstName} onChange={handleChange} placeholder="John"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Last Name</label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-person"></i></span>
                      <input
                        type="text" className="form-control form-control-custom" name="lastName"
                        value={profile.lastName} onChange={handleChange} placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Email Address (Non-editable)</label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-envelope"></i></span>
                      <input
                        type="email" className="form-control form-control-custom" name="email"
                        value={profile.email} disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-telephone"></i></span>
                      <input
                        type="text" className="form-control form-control-custom" name="phone"
                        value={profile.phone} onChange={handleChange} placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional details */}
              <div className="profile-card mb-4">
                <h5 className="profile-card-title"><i className="bi bi-briefcase"></i> Professional Summary</h5>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label-custom">Total Experience</label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-bar-chart"></i></span>
                      <input
                        type="text" className="form-control form-control-custom" name="experience"
                        placeholder="e.g. Fresher / 3 Years" value={profile.experience} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label-custom">Key Skills</label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-tools"></i></span>
                      <input
                        type="text" className="form-control form-control-custom" name="skills"
                        placeholder="React, User Experience, API Design (Comma separated)"
                        value={profile.skills} onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="profile-card mb-4">
                <h5 className="profile-card-title"><i className="bi bi-mortarboard"></i> Academic Background</h5>
                {profile.education.map((edu, index) => (
                  <div key={index} className="p-3 mb-3 bg-light rounded border position-relative">
                    <button
                      type="button"
                      className="btn-close position-absolute top-0 end-0 m-2"
                      onClick={() => removeEducation(index)}
                      aria-label="Remove"
                    ></button>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label-custom small">Degree/Level</label>
                        <input
                          type="text" className="form-control form-control-custom" placeholder="e.g. B.Tech Computer Science"
                          value={edu.level} onChange={(e) => handleEducationChange(index, "level", e.target.value)}
                        />
                      </div>
                      <div className="col-md-5">
                        <label className="form-label-custom small">Institution</label>
                        <input
                          type="text" className="form-control form-control-custom" placeholder="e.g. Stanford University"
                          value={edu.institution} onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label-custom small">Passing Year</label>
                        <input
                          type="text" className="form-control form-control-custom" placeholder="e.g. 2023"
                          value={edu.year} onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-outline-custom btn-sm mt-2" onClick={addEducation}>
                  <i className="bi bi-plus-circle me-1"></i> Add Education History
                </button>
              </div>

              {/* Resume Upload */}
              <div className="profile-card mb-5">
                <h5 className="profile-card-title"><i className="bi bi-file-earmark-pdf"></i> Resume Attachment</h5>

                <div className="p-4 border border-dashed rounded bg-light text-center">
                  <i className="bi bi-cloud-arrow-up display-4 text-primary mb-3"></i>
                  <input
                    type="file"
                    className="form-control form-control-custom mx-auto"
                    style={{ maxWidth: '400px' }}
                    accept="application/pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <div className="form-text mt-2">Upload a new resume (PDF format only, Max 5MB).</div>
                </div>

                {profile.resume && (
                  <div className="mt-3 text-center">
                    <span className="badge bg-success bg-opacity-10 text-success p-2">
                      <i className="bi bi-check-circle-fill me-1"></i> Resume currently uploaded
                    </span>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-3 mb-5">
                <button
                  type="button"
                  className="btn-outline-custom"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Saving...</>
                  ) : (
                    <><i className="bi bi-save me-2"></i> Save Profile Details</>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ================= VIEW MODE ================= */
            <div className="view-profile-mode mb-5">

              {/* Header Bio Card */}
              <div className="profile-card mb-4 text-center text-md-start">
                <div className="row align-items-center">
                  <div className="col-md-3 text-center mb-3 mb-md-0">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mx-auto" style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                      {(profile.firstName?.[0] || "") + (profile.lastName?.[0] || "") || <i className="bi bi-person"></i>}
                    </div>
                  </div>
                  <div className="col-md-9">
                    <h3 className="fw-bold mb-1">{`${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Complete Your Profile"}</h3>
                    <p className="text-primary fw-semibold mb-3">{profile.experience || "Experience not specified"}</p>
                    <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start text-muted">
                      <span><i className="bi bi-envelope me-2"></i>{profile.email}</span>
                      <span><i className="bi bi-telephone me-2"></i>{profile.phone || "No phone added"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {/* Left Column */}
                <div className="col-lg-7">
                  {/* Skills Section */}
                  <div className="profile-card h-100">
                    <h5 className="profile-card-title"><i className="bi bi-lightning-charge"></i> Core Skills</h5>
                    {profile.skills ? (
                      <div className="mt-3">
                        {profile.skills.split(',').map((skill, i) => (
                          <span key={i} className="skill-badge">{skill.trim()}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted fst-italic">No skills added yet.</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-5">
                  {/* Resume Section */}
                  <div className="profile-card h-100 text-center">
                    <h5 className="profile-card-title justify-content-center"><i className="bi bi-file-earmark-person"></i> Resume</h5>
                    {profile.resume ? (
                      <div className="mt-4">
                        <i className="bi bi-filetype-pdf text-danger display-4 mb-3 d-block"></i>
                        <a href={`http://localhost:5000${profile.resume}`} target="_blank" rel="noopener noreferrer" className="btn-primary-custom d-inline-block text-decoration-none">
                          <i className="bi bi-eye me-2"></i>View Resume
                        </a>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <div className="bg-light rounded p-4 border border-dashed text-muted">
                          <i className="bi bi-x-circle fs-2 d-block mb-2"></i>
                          No Resume Found
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row - Education */}
                <div className="col-12">
                  <div className="profile-card">
                    <h5 className="profile-card-title"><i className="bi bi-journal-bookmark"></i> Education History</h5>
                    {profile.education && profile.education.length > 0 ? (
                      <div className="mt-4 position-relative">
                        {/* Timeline styling for education map */}
                        <div className="position-absolute h-100 border-start border-2 border-primary ms-3" style={{ opacity: 0.2 }}></div>

                        {profile.education.map((edu, i) => (
                          <div key={i} className="d-flex mb-4 position-relative">
                            <div className="bg-primary rounded-circle mt-1 z-1" style={{ width: '20px', height: '20px', marginLeft: '24px', flexShrink: 0 }}></div>
                            <div className="ms-4 bg-light rounded p-3 flex-grow-1 border">
                              <h6 className="fw-bold mb-1">{edu.level}</h6>
                              <div className="d-flex justify-content-between text-muted small">
                                <span><i className="bi bi-building me-1"></i>{edu.institution}</span>
                                <span className="badge bg-secondary text-white">{edu.year}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted fst-italic">No education details added yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
