import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import api from "../api/axios";

import { useSearchParams } from "react-router-dom";

function Jobs() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs", {
        params: {
          title: search,
          location: location,
          experience: experience
        }
      });
      setAllJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's applied jobs
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const fetchApplied = async () => {
        try {
          const res = await api.get(`/applications/user/${user._id}`);
          const ids = new Set(res.data.map(app => app.job?._id || app.job));
          setAppliedJobIds(ids);
        } catch (err) {
          console.error("Failed to fetch applications", err);
        }
      };
      fetchApplied();
    }
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [search]);

  const handleSearch = () => {
    fetchJobs();
  };

  const filteredJobs = allJobs;

  return (
    <div className="container mt-4">
      <h3>Available Jobs</h3>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by job title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="">All Experience</option>
            <option value="0-2">0–2 Years</option>
            <option value="1-3">1–3 Years</option>
            <option value="2-4">2–4 Years</option>
          </select>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 text-center">
          <button className="btn btn-primary px-5" onClick={handleSearch}>
            Search Jobs
          </button>
        </div>
      </div>

      {/* Job List */}
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="row">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job._id} className="col-md-4 mb-4">
                <JobCard job={job} isApplied={appliedJobIds.has(job._id)} />
              </div>
            ))
          ) : (
            <p className="text-center">No jobs found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Jobs;
