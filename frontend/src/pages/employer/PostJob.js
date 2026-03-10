import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./PostJob.css"; // Import new CSS

function PostJob() {
  const [job, setJob] = useState({
    title: "",
    skills: "",
    salary: "",
    company: "",
    location: "",
    experience: "",
    description: "",
    type: "Full-time",
    deadline: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/jobs", {
        ...job,
        postedBy: user._id,
        skills: job.skills.split(",").map(s => s.trim()) // Convert comma string to array
      });
      alert("Job posted successfully!");
      navigate("/employer/manage-jobs");
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-job-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">

            <div className="post-job-header text-center mb-5">
              <h2><i className="bi bi-briefcase text-primary me-2"></i>Post a New Job</h2>
              <p>Reach thousands of qualified candidates by defining your ideal role.</p>
            </div>

            <div className="post-job-card">
              <form onSubmit={handleSubmit}>

                {/* Basic Details Section */}
                <h4 className="section-title"><i className="bi bi-info-circle"></i> Basic Details</h4>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Job Title <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-fonts"></i></span>
                      <input
                        required
                        className="form-control form-control-custom"
                        name="title"
                        placeholder="e.g. Senior Frontend Developer"
                        onChange={handleChange}
                        value={job.title}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Company Name <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-building"></i></span>
                      <input
                        required
                        className="form-control form-control-custom"
                        name="company"
                        placeholder="e.g. TechCorp Solutions"
                        onChange={handleChange}
                        value={job.company}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Location <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-geo-alt"></i></span>
                      <input
                        required
                        className="form-control form-control-custom"
                        name="location"
                        placeholder="e.g. New York, NY or Remote"
                        onChange={handleChange}
                        value={job.location}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Employment Type <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-clock-history"></i></span>
                      <select
                        className="form-select form-control-custom"
                        name="type"
                        value={job.type}
                        onChange={handleChange}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Requirements Section */}
                <h4 className="section-title mt-5"><i className="bi bi-list-check"></i> Role Requirements</h4>
                <div className="row g-4 mb-4">
                  <div className="col-md-12">
                    <label className="form-label">Required Skills <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-tools"></i></span>
                      <input
                        required
                        className="form-control form-control-custom"
                        name="skills"
                        placeholder="e.g. React, Node.js, MongoDB (Comma separated)"
                        onChange={handleChange}
                        value={job.skills}
                      />
                    </div>
                    <small className="text-muted mt-1 d-block"><i className="bi bi-info-circle me-1"></i>Separate multiple skills with commas.</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Experience Required <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-bar-chart"></i></span>
                      <input
                        required
                        className="form-control form-control-custom"
                        name="experience"
                        placeholder="e.g. 3-5 Years"
                        onChange={handleChange}
                        value={job.experience}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Salary Range <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-cash"></i></span>
                      <input
                        required
                        className="form-control form-control-custom"
                        name="salary"
                        placeholder="e.g. $80k - $100k or Competitive"
                        onChange={handleChange}
                        value={job.salary}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <h4 className="section-title mt-5"><i className="bi bi-file-text"></i> Description & Details</h4>
                <div className="row g-4 mb-5">
                  <div className="col-md-12">
                    <label className="form-label">Job Description <span className="text-danger">*</span></label>
                    <textarea
                      required
                      className="form-control form-control-custom"
                      name="description"
                      placeholder="Describe the role, responsibilities, and ideal candidate..."
                      rows="6"
                      onChange={handleChange}
                      value={job.description}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Application Deadline</label>
                    <div className="input-group">
                      <span className="input-group-text input-group-text-custom"><i className="bi bi-calendar-event"></i></span>
                      <input
                        type="date"
                        className="form-control form-control-custom"
                        name="deadline"
                        onChange={handleChange}
                        value={job.deadline}
                      />
                    </div>
                  </div>
                </div>

                <hr className="mb-4 text-muted border-2 opacity-10" />

                <div className="row justify-content-end">
                  <div className="col-md-4">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> Posting Mode...</>
                      ) : (
                        <><i className="bi bi-send-fill"></i> Publish Job Listing</>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostJob;
