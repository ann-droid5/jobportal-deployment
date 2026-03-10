import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-modern">
      <div className="footer-top-shape">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100"><path fill="#ffffff" fillOpacity="1" d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path></svg>
      </div>
      <div className="container footer-container">
        <div className="row g-5">
          {/* Brand */}
          <div className="col-lg-5 col-md-6 mb-4 mb-md-0">
            <h3 className="footer-brand-name">
              JOB PORTAL
            </h3>
            <p className="footer-brand-desc mt-3">
              Connecting talented professionals with top-tier companies. Explore verified
              opportunities, apply with confidence, and take the next big step in your career.
            </p>
            <div className="footer-socials mt-4">
              <a href="#!" className="social-icon"><i className="bi bi-linkedin"></i></a>
              <a href="#!" className="social-icon"><i className="bi bi-twitter-x"></i></a>
              <a href="#!" className="social-icon"><i className="bi bi-instagram"></i></a>
            </div>
          </div>

          {/* Job Seekers */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="footer-title">Job Seekers</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/jobs">Browse All Jobs</Link></li>
              <li><Link to="/signup">Job Seeker Signup</Link></li>
              <li><Link to="/resume" data-bs-toggle="modal" data-bs-target="#loginModal">Upload Resume</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-title">Employers & Partners</h5>
            <ul className="footer-links">
              <li><Link to="/employer/post-job">Post a Job</Link></li>
              <li><Link to="/employer/signup">Employer Login / Signup</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container d-flex justify-content-between align-items-center flex-wrap">
          <p className="mb-0">© {new Date().getFullYear()} Job Portal. All rights reserved.</p>
          <p className="mb-0 developed-by">Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
