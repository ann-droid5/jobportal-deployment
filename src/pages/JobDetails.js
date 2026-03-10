import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverMessage, setCoverMessage] = useState("");
  const [user, setUser] = useState(null);
  const [resumeOption, setResumeOption] = useState("upload");
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      // Fetch fresh user data to check for saved resume
      const fetchUser = async () => {
        try {
          const res = await api.get(`/users/${storedUser._id}`);
          setUser(res.data);
          if (res.data.resume) setResumeOption("saved");
        } catch (e) {
          console.error("Failed to fetch user");
        }
      }
      fetchUser();
    }
  }, []);

  useEffect(() => {
    const fetchJobAndStatus = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          const appRes = await api.get(`/applications/user/${storedUser._id}`);
          const appliedJobIds = new Set(appRes.data.map(app => app.job?._id || app.job));
          if (appliedJobIds.has(id)) {
            setIsApplied(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch job or application status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndStatus();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert("Please login to apply");
      return;
    }

    if (resumeOption === "upload" && !resumeFile) {
      alert("Please upload a resume (PDF)");
      return;
    }

    try {
      setApplying(true);
      const formData = new FormData();
      formData.append("jobId", id);
      formData.append("applicantId", user._id);
      formData.append("message", coverMessage);

      if (resumeOption === "saved") {
        formData.append("useSavedResume", "true");
      } else {
        formData.append("resume", resumeFile);
      }

      await api.post("/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Applied successfully!");
      navigate("/applications");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const displaySkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') return skills.split(',').map(s => s.trim());
    return [];
  };

  if (loading) return (
    <div className="job-details-page-wrapper d-flex justify-content-center align-items-center">
      <div className="text-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        <h5 className="mt-3 fw-semibold text-secondary">Loading job details...</h5>
      </div>
    </div>
  );

  if (!job) return (
    <div className="job-details-page-wrapper d-flex justify-content-center align-items-center">
      <div className="text-center">
        <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
        <h3>Job not found</h3>
        <Link to="/jobs" className="btn btn-primary mt-3">Browse other jobs</Link>
      </div>
    </div>
  );

  return (
    <div className="job-details-page-wrapper">

      {/* Hero Section */}
      <div className="job-details-hero">
        <div className="container">
          <Link to="/jobs" className="back-link-custom">
            <i className="bi bi-arrow-left me-2"></i>Back to search results
          </Link>

          <div>
            <span className="badge-hiring-custom"><i className="bi bi-fire me-1"></i> Actively Hiring</span>
          </div>

          <h1 className="job-hero-title">{job.title}</h1>
          <div className="job-hero-company">
            <i className="bi bi-building"></i>
            {job.company}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container">
        <div className="row g-4">

          {/* Left Column: Job Description & Details */}
          <div className="col-lg-8">

            <div className="jd-card">
              <h4 className="jd-card-header"><i className="bi bi-info-square"></i> Job Overview</h4>
              <div className="jd-meta-grid">
                <div className="jd-meta-item">
                  <div className="jd-meta-icon"><i className="bi bi-geo-alt"></i></div>
                  <div className="jd-meta-info">
                    <h6>Location</h6>
                    <p>{job.location}</p>
                  </div>
                </div>
                <div className="jd-meta-item">
                  <div className="jd-meta-icon"><i className="bi bi-briefcase"></i></div>
                  <div className="jd-meta-info">
                    <h6>Experience Requirements</h6>
                    <p>{job.experience || "Not specified"}</p>
                  </div>
                </div>
                <div className="jd-meta-item">
                  <div className="jd-meta-icon"><i className="bi bi-cash-stack"></i></div>
                  <div className="jd-meta-info">
                    <h6>Salary Expected</h6>
                    <p>{job.salary || "Not Disclosed"}</p>
                  </div>
                </div>
                <div className="jd-meta-item">
                  <div className="jd-meta-icon"><i className="bi bi-clock-history"></i></div>
                  <div className="jd-meta-info">
                    <h6>Job Type</h6>
                    <p>{job.type || "Full-time"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="jd-card">
              <h4 className="jd-card-header"><i className="bi bi-card-text"></i> Job Description</h4>
              <div className="jd-content-text">
                {job.description}
              </div>
            </div>

            <div className="jd-card">
              <h4 className="jd-card-header"><i className="bi bi-stars"></i> Required Skills</h4>
              <div className="skills-container mt-3">
                {displaySkills(job.skills).map((s, i) => (
                  <span key={i} className="jd-skill-pill">{s}</span>
                ))}
              </div>
            </div>

            {/* Inline Application Form */}
            {showApplyForm && (
              <div className="apply-form-container animate-fade-in" id="application-form">
                <h4 className="jd-card-header border-0 mb-2"><i className="bi bi-send text-success"></i> Submit Application</h4>
                <p className="text-muted mb-4">You are applying for the role of <strong>{job.title}</strong> at <strong>{job.company}</strong>.</p>

                <div className="mb-4">
                  <label className="form-label-custom">Resume Upload</label>

                  {user && user.resume ? (
                    <div className="radio-custom-group">
                      <div>
                        <input className="form-check-input d-none" type="radio" name="resumeOption" id="useSaved"
                          checked={resumeOption === "saved"} onChange={() => setResumeOption("saved")} />
                        <label className="radio-custom-label" htmlFor="useSaved">
                          <i className={`bi fs-5 ${resumeOption === "saved" ? "bi-check-circle-fill text-primary" : "bi-circle text-muted"}`}></i>
                          <span>Use saved profile resume</span>
                          <a href={`http://localhost:5000${user.resume}`} target="_blank" rel="noopener noreferrer" className="ms-auto btn btn-sm btn-outline-primary" onClick={e => e.stopPropagation()}>View PDF</a>
                        </label>
                      </div>

                      <div>
                        <input className="form-check-input d-none" type="radio" name="resumeOption" id="uploadNew"
                          checked={resumeOption === "upload"} onChange={() => setResumeOption("upload")} />
                        <label className="radio-custom-label" htmlFor="uploadNew">
                          <i className={`bi fs-5 ${resumeOption === "upload" ? "bi-check-circle-fill text-primary" : "bi-circle text-muted"}`}></i>
                          <span>Upload a different resume</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-info border-0 bg-primary bg-opacity-10 text-primary">
                      <i className="bi bi-info-circle me-2"></i> You don't have a saved resume in your profile.
                    </div>
                  )}

                  {(resumeOption === "upload" || !user?.resume) && (
                    <div className="mt-3 p-3 bg-white rounded border border-secondary">
                      <input type="file" accept="application/pdf" className="form-control" onChange={(e) => setResumeFile(e.target.files[0])} />
                      <div className="form-text mt-2"><i className="bi bi-file-earmark-pdf text-danger mx-1"></i> PDF files only, Max 5MB.</div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label-custom">Cover Letter / Message (Optional)</label>
                  <textarea
                    className="form-control form-control-custom" rows="4"
                    placeholder="Briefly explain why you're a great fit for this position..."
                    value={coverMessage} onChange={(e) => setCoverMessage(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button className="btn btn-secondary px-4 fw-bold" onClick={() => setShowApplyForm(false)} disabled={applying}>Cancel</button>
                  <button className="btn btn-success px-5 fw-bold ms-auto" onClick={handleApply} disabled={applying}>
                    {applying ? <><span className="spinner-border spinner-border-sm me-2"></span> Sending...</> : <><i className="bi bi-send me-2"></i> Submit Application</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar actions */}
          <div className="col-lg-4">
            <div className="jd-action-sidebar">

              <div className="jd-card jd-action-card border-primary border-opacity-25">
                <h5 className="fw-bold mb-4">Ready to take the next step?</h5>

                {isApplied ? (
                  <div className="alert alert-success border-0 bg-success bg-opacity-10 d-flex flex-column align-items-center text-center">
                    <i className="bi bi-check-circle-fill display-4 text-success mb-2"></i>
                    <strong>Already Applied!</strong>
                    <p className="mb-0 mt-2 small">You have already submitted an application for this role.</p>
                    <Link to="/applications" className="btn btn-outline-success btn-sm mt-3 w-100 fw-bold">View Status</Link>
                  </div>
                ) : !applying && !showApplyForm ? (
                  <>
                    <button
                      className="btn apply-btn-master text-white"
                      onClick={() => {
                        if (!user) {
                          alert("Please login to apply");
                          navigate("/login");
                        } else {
                          setShowApplyForm(true);
                          setTimeout(() => {
                            document.getElementById('application-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 100);
                        }
                      }}
                    >
                      Apply for this job
                    </button>
                  </>
                ) : (
                  <div className="alert alert-success border-0 bg-success bg-opacity-10">
                    <i className="bi bi-pencil-square fs-1 text-success d-block mb-2"></i>
                    <strong>Fill out the form</strong><br />to complete your application
                  </div>
                )}

              </div>

              <div className="text-center text-muted small px-3">
                <i className="bi bi-shield-check me-1 text-success"></i>
                Apply safely through Job Portal. We never share your contact details without permission.
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetails;
