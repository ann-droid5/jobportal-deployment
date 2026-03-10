import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import api from "../api/axios";
import { useSearchParams } from "react-router-dom";
import "./Jobs.css"; // Implemented premium CSS

function Jobs() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [hasSkills, setHasSkills] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

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


  // Fetch user's applied and recommended jobs
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          // Fetch Applied Jobs
          const appliedRes = await api.get(`/applications/user/${user._id}`);
          const ids = new Set(appliedRes.data.map(app => app.job?._id || app.job));
          setAppliedJobIds(ids);

          // Fetch Recommended Jobs if jobseeker
          if (user.role === 'jobseeker') {
            const recRes = await api.get(`/jobs/recommended/${user._id}`);
            setRecommendedJobs(recRes.data.recommendations || []);
            setHasSkills(recRes.data.hasSkills);
          }
        } catch (err) {
          console.error("Failed to fetch user specific data", err);
        }
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearch = () => {
    fetchJobs();
  };

  const filteredJobs = allJobs.filter(job => !appliedJobIds.has(job._id));
  const filteredRecommendedJobs = recommendedJobs.filter(job => !appliedJobIds.has(job._id));

  return (
    <div className="jobs-page-container">
      {/* Header Section */}
      <div className="jobs-page-header">
        <div className="container text-center text-md-start">
          <h1 className="jobs-header-title">Find Your Dream Job</h1>
          <p className="jobs-header-subtitle">
            Explore thousands of job opportunities with all the information you need.
            Search by title, location, and experience.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Search & Filter Box */}
        <div className="jobs-search-box mb-5">
          <div className="row g-3 align-items-center">
            {/* Keyword Search */}
            <div className="col-lg-4 col-md-12">
              <div className="search-input-group">
                <i className="bi bi-search search-icon-left"></i>
                <input
                  type="text"
                  className="form-control search-control-custom w-100"
                  placeholder="Job title, keywords, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="col-lg-3 col-md-6">
              <div className="search-input-group">
                <i className="bi bi-geo-alt search-icon-left"></i>
                <select
                  className="form-select search-control-custom w-100"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Remote">Remote (WFH)</option>
                </select>
              </div>
            </div>

            {/* Experience Filter */}
            <div className="col-lg-3 col-md-6">
              <div className="search-input-group">
                <i className="bi bi-briefcase search-icon-left"></i>
                <select
                  className="form-select search-control-custom w-100"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="">Any Experience</option>
                  <option value="0-2">Entry Level (0-2 Yrs)</option>
                  <option value="1-3">Junior (1-3 Yrs)</option>
                  <option value="3-5">Mid Level (3-5 Yrs)</option>
                  <option value="5+">Senior (5+ Yrs)</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="col-lg-2 col-md-12">
              <button className="btn btn-primary search-btn-custom w-100" onClick={handleSearch}>
                Find Jobs
              </button>
            </div>
          </div>
        </div>

        {/* --- AI Recommendations Section --- */}
        {user && user.role === 'jobseeker' && (
          <div className="mb-5">
            {hasSkills === false ? (
              <div className="skills-banner p-4 rounded-4 shadow-sm text-white d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
                <div className="d-flex align-items-center mb-3 mb-md-0">
                  <i className="bi bi-stars fs-1 me-3 text-warning"></i>
                  <div>
                    <h4 className="fw-bold mb-1">Boost Your Career with AI!</h4>
                    <p className="mb-0 text-white-50">Complete your profile with your skills to unlock personalized, AI-curated job recommendations.</p>
                  </div>
                </div>
                <button
                  className="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow-sm text-dark transition-all"
                  onClick={() => window.location.href = '/profile'}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <i className="bi bi-person-fill-gear me-2"></i> Add Skills
                </button>
              </div>
            ) : filteredRecommendedJobs.length > 0 && (
              <div className="recommended-section-wrapper mb-5">
                <div className="d-flex align-items-center mb-4 position-relative z-1">
                  <div className="bg-purple-100 rounded-circle p-2 me-3" style={{ background: '#f3e8ff' }}>
                    <i className="bi bi-robot fs-4" style={{ color: '#9333ea' }}></i>
                  </div>
                  <h4 className="recommended-title mb-0">Suggested Matches for You</h4>
                </div>
                <div className="row g-4 flex-row flex-nowrap overflow-auto px-2 pb-4 custom-scrollbar position-relative z-1" style={{ scrollSnapType: 'x mandatory' }}>
                  {filteredRecommendedJobs.map((job) => (
                    <div key={job._id} className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4 flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                      <div className="position-relative h-100 mt-2">
                        {/* Premium AI Badge overlay */}
                        <div className="position-absolute badge rounded-pill ai-match-badge"
                          style={{ top: '-12px', right: '10px' }}>
                          <i className="bi bi-magic me-1"></i> {job.matchPercentage}% Match
                        </div>
                        <JobCard job={job} isApplied={appliedJobIds.has(job._id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* --- End AI Recommendations Section --- */}


        {/* Results Info */}
        {!loading && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-dark mb-0">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h5>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Sort by:</span>
              <select className="form-select form-select-sm border-0 bg-transparent text-primary fw-bold" style={{ width: 'auto', cursor: 'pointer' }}>
                <option>Newest</option>
                <option>Relevant</option>
              </select>
            </div>
          </div>
        )}

        {/* Job List Grid */}
        {loading ? (
          <div className="jobs-loader-container">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
            <h5 className="mt-3 fw-semibold">Fetching opportunities...</h5>
          </div>
        ) : (
          <div className="row g-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job._id} className="col-xl-4 col-lg-6 col-md-6 mb-2">
                  <JobCard job={job} isApplied={appliedJobIds.has(job._id)} />
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="no-jobs-state">
                  <i className="bi bi-journal-x no-jobs-icon"></i>
                  <h3 className="fw-bold text-dark">No matching jobs found</h3>
                  <p className="text-muted">Try adjusting your search criteria, removing filters, or searching for broader terms.</p>
                  <button
                    className="btn btn-outline-primary mt-3"
                    onClick={() => { setSearch(""); setLocation(""); setExperience(""); fetchJobs(); }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;
