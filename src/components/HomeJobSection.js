import { useState } from "react";
import { Link } from "react-router-dom";
import "./HomeJobSection.css"; // Import the new CSS file

function HomeJobSection() {
  const categories = [
    "All", "Big brands", "Work from home", "MBA", "Engineering", "Media", "Design", "Data Science"
  ];

  const jobs = [
    { id: 1, title: "E-commerce Sales Executive", company: "603 CoWorking", location: "Mumbai", salary: "₹2–2.2 LPA", category: "Big brands" },
    { id: 2, title: "Customer Service Associate", company: "Bharti AXA", location: "Chandigarh", salary: "₹2–2.5 LPA", category: "Big brands" },
    { id: 3, title: "Accountant", company: "ZUCOL", location: "Jaipur", salary: "₹2–2.5 LPA", category: "MBA" },
    { id: 4, title: "Frontend Developer", company: "Tech Mahindra", location: "Bangalore", salary: "₹3–4 LPA", category: "Engineering" },
    { id: 5, title: "UI/UX Designer", company: "Creative Minds", location: "Remote", salary: "₹2.5–3.5 LPA", category: "Design" },
    { id: 6, title: "Data Analyst Intern", company: "Analytics Hub", location: "Remote", salary: "₹20k/month", category: "Data Science" },
    { id: 7, title: "HR Recruiter", company: "Talent Bridge", location: "Pune", salary: "₹2–2.6 LPA", category: "MBA" },
    { id: 8, title: "Java Developer", company: "Infosys", location: "Hyderabad", salary: "₹3.5–4.5 LPA", category: "Engineering" },
    { id: 9, title: "Content Writer", company: "WriteSmart", location: "WFH", salary: "₹18k/month", category: "Work from home" }
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredJobs =
    activeCategory === "All"
      ? jobs
      : jobs.filter(job => job.category === activeCategory);

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

        {/* Carousel */}
        {filteredJobs.length > 0 ? (
          <div id="jobCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner px-2 py-3"> {/* Added padding for hover effects */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <div className="row">
                    {slide.map(job => (
                      <div key={job.id} className="col-12 col-sm-6 col-lg-3">
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
                              <span className="badge bg-light text-secondary border">Full Time</span>
                              <Link to={`/jobs/${job.id}`} className="btn-view-details">
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
            <button className="carousel-control-prev" type="button" data-bs-target="#jobCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#jobCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-emoji-frown fs-1 d-block mb-3"></i>
            <p>No jobs found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeJobSection;
