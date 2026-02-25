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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      // Optionally fetch fresh user data to check for saved resume
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
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Failed to fetch job", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert("Please login to apply");
      return;
    }

    // Only require a file if the user chose "upload" (or has no saved resume)
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

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!job) return <div className="container mt-4">Job not found</div>;

  return (
    <div className="container job-details-page mt-4">
      <Link to="/jobs" className="back-link">
        ← Back to jobs
      </Link>

      <div className="job-details-card">
        <span className="badge hiring-badge">Actively hiring</span>

        <h3>{job.title}</h3>
        <p className="company">{job.company}</p>

        <div className="job-meta">
          <span><i className="bi bi-geo-alt"></i> {job.location}</span>
          <span><i class="bi bi-briefcase"></i> {job.experience}</span>
          <span><i className="bi bi-cash-stack"></i> {job.salary}</span>
        </div>

        <hr />

        <h5>Job description</h5>
        <p>{job.description}</p>

        <h5>Key responsibilities</h5>
        {/* Render only if responsibilities exist or just description for now since backend model is simple */}
        <p>{job.description}</p>

        <h5>Skills required</h5>
        <div className="skills">
          {job.skills.map((s, i) => (
            <span key={i} className="skill-pill">{s}</span>
          ))}
        </div>

        <h5>Perks</h5>
        <p>Not specified</p>

        {!applying && !showApplyForm && (
          <button
            className="btn btn-primary apply-btn"
            onClick={() => {
              const user = JSON.parse(localStorage.getItem("user"));
              if (!user) {
                alert("Please login to apply");
                // navigate("/login"); // Optional: Redirect to login
              } else {
                setShowApplyForm(true);
              }
            }}
          >
            Apply Now
          </button>
        )}

        {/* Inline Apply Form */}
        {showApplyForm && (
          <div className="mt-4 p-4 bg-light rounded border animate-fade-in shadow-sm">
            <h5 className="mb-3 text-primary">Submit your application</h5>

            {/* Resume Selection */}
            <div className="mb-3">
              <label className="form-label fw-bold">Resume</label>

              {user && user.resume ? (
                <div className="mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="resumeOption"
                      id="useSaved"
                      checked={resumeOption === "saved"}
                      onChange={() => setResumeOption("saved")}
                    />
                    <label className="form-check-label" htmlFor="useSaved">
                      Use Saved Resume <a href={`http://localhost:5000${user.resume}`} target="_blank" rel="noopener noreferrer" className="ms-2 small text-primary">(View)</a>
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="resumeOption"
                      id="uploadNew"
                      checked={resumeOption === "upload"}
                      onChange={() => setResumeOption("upload")}
                    />
                    <label className="form-check-label" htmlFor="uploadNew">
                      Upload New Resume
                    </label>
                  </div>
                </div>
              ) : (
                <p className="small text-muted mb-2">You don't have a saved resume in your profile to use for one-click apply.</p>
              )}

              {(resumeOption === "upload" || !user?.resume) && (
                <div>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-control"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <div className="form-text">Please upload your resume in PDF format (Max 5MB).</div>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Cover Message</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Why are you a good fit for this role?"
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-success px-4"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : "Submit Application"}
              </button>
              <button
                className="btn btn-outline-secondary px-4"
                onClick={() => setShowApplyForm(false)}
                disabled={applying}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetails;
