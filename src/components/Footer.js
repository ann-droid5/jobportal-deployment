import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-col brand">
          <h3 className="brand-name">JOB PORTAL</h3>
          <p className="brand-desc">
            Connecting job seekers with top companies. Explore verified
            opportunities, apply with confidence, and grow your career.
          </p>
        </div>

        {/* Job Seekers */}
        <div className="footer-col">
          <h4>Job Seekers</h4>
          <ul>
            <li><a href="/">Browse Jobs</a></li>
            <li><a href="/">Fresher Jobs</a></li>
            <li><a href="/">Work From Home</a></li>
            <li><a href="/">Internships</a></li>
            <li><a href="/">Upload Resume</a></li>
          </ul>
        </div>

        {/* Employers */}
        <div className="footer-col">
          <h4>Employers</h4>
          <ul>
            <li><a href="/">Post a Job</a></li>
            <li><a href="/">Employer Login</a></li>
            <li><a href="/">Search Candidates</a></li>
            <li><a href="/">Pricing Plans</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="/">Career Advice</a></li>
            <li><a href="/">Resume Tips</a></li>
            <li><a href="/">Interview Prep</a></li>
            <li><a href="/">Skill Courses</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="/">Help Center</a></li>
            <li><a href="/">Contact Us</a></li>
            <li><a href="/">Privacy Policy</a></li>
            <li><a href="/">Terms & Conditions</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Job Portal. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
