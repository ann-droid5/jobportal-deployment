import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

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
    }
  };

  return (
    <div className="container mt-4">
      <h3>Post Job</h3>

      <form className="mt-3" onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="skills"
          placeholder="Required Skills"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="company"
          placeholder="Company Name"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="location"
          placeholder="Location"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="experience"
          placeholder="Experience Required (e.g. 2 years)"
          onChange={handleChange}
        />

        <div className="row">
          <div className="col-md-6 mb-3">
            <select className="form-select" name="type" value={job.type} onChange={handleChange}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="date"
              className="form-control"
              name="deadline"
              onChange={handleChange}
            />
          </div>
        </div>

        <input
          className="form-control mb-3"
          name="salary"
          placeholder="Salary Range"
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-3"
          name="description"
          placeholder="Job Description"
          rows="4"
          onChange={handleChange}
        />

        <button className="btn btn-primary">
          Post Job
        </button>
      </form>
    </div>
  );
}

export default PostJob;
