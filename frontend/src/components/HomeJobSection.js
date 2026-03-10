import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./HomeJobSection.css";

function HomeJobSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adjusted categories to match common DB fields or types
  const categories = [
    "All", "Full-time", "Internship", "Part-time", "Remote"
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Remote") {
      return job.location?.toLowerCase().includes("remote") || job.location?.toLowerCase().includes("wfh");
    }
    return job.type === activeCategory;
  });

  // Split jobs into chunks of 4 for carousel slides
  const chunkSize = 4;
  const slides = [];
  for (let i = 0; i < filteredJobs.length; i += chunkSize) {
    slides.push(filteredJobs.slice(i, i + chunkSize));
  }

  return (
    <div className="py-5" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)" }}>
      <div className="container home-job-section position-relative">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Explore Our Jobs</h2>
          <h4 className="text-muted">Find the perfect role for you</h4>
        </div>

        {/* Pills */}
        <div className="mb-5 d-flex flex-wrap gap-2 justify-content-center category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn rounded-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {activeCategory === cat && <i className="bi bi-check-lg me-1"></i>}
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          /* Carousel */
          filteredJobs.length > 0 ? (
            <div id="jobCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner px-2 py-3">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <div className="row">
                      {slide.map(job => (
                        <div key={job._id} className="col-12 col-sm-6 col-lg-3 mb-4 mb-lg-0">
                          <div className="job-card-wrapper h-100">
                            <div className="custom-job-card h-100 d-flex flex-column">
                              <span className="badge bg-primary bg-opacity-10 text-primary w-auto me-auto mb-3">Actively Hiring</span>
                              <h6>{job.title}</h6>
                              <p className="company-name">{job.company}</p>

                              <div className="job-details mt-auto">
                                <p className="mb-1"><i className="bi bi-geo-alt"></i> {job.location}</p>
                                <p className="mb-0"><i className="bi bi-cash-stack"></i> {job.salary}</p>
                              </div>

                              <div className="card-footer-custom">
                                <span className="badge bg-light text-secondary border">{job.type || "Full-time"}</span>
                                <Link to={`/jobs/${job._id}`} className="btn-view-details">
                                  View Details <i className="bi bi-arrow-right ms-1"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              {slides.length > 1 && (
                <>
                  <button className="carousel-control-prev" type="button" data-bs-target="#jobCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon bg-primary rounded-circle p-2" aria-hidden="true" style={{ width: '35px', height: '35px', backgroundSize: '50%' }}></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#jobCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon bg-primary rounded-circle p-2" aria-hidden="true" style={{ width: '35px', height: '35px', backgroundSize: '50%' }}></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-emoji-frown fs-1 d-block mb-3"></i>
              <p>No jobs found in this category.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default HomeJobSection;
