import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from '../data/courses';

function CourseDetail() {
    const { slug } = useParams();
    const course = courses.find(c => c.slug === slug);

    if (!course) {
        return <div className="container mt-5"><h3>Course not found</h3></div>;
    }

    return (
        <div className="container-fluid p-0">
            {/* Hero Section */}
            <div className="bg-dark text-white py-5" style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${course.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-4 fw-bold">{course.title}</h1>
                            <p className="lead">{course.description}</p>
                            <Link to="/" className="btn btn-primary btn-lg mt-3 me-2">
                                Enquire Now <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container my-5">
                <div className="row">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        <div className="mb-5">
                            <h3 className="fw-bold mb-4 border-bottom pb-2">Course Curriculum</h3>
                            <div className="row">
                                {course.curriculum.map((item, index) => (
                                    <div key={index} className="col-md-12 mb-2">
                                        <div className="d-flex align-items-center bg-light p-3 rounded">
                                            <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                                            <span className="fw-medium">{item}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 sticky-top" style={{ top: "100px" }}>
                            <div className="card-body">
                                <h4 className="card-title fw-bold mb-4">Course Highlights</h4>

                                <ul className="list-unstyled">
                                    <li className="mb-3 d-flex align-items-center">
                                        <i className="bi bi-clock-history text-warning fs-4 me-3"></i>
                                        <div>
                                            <small className="text-muted d-block">Duration</small>
                                            <strong>{course.duration}</strong>
                                        </div>
                                    </li>
                                    <li className="mb-3 d-flex align-items-center">
                                        <i className="bi bi-laptop text-info fs-4 me-3"></i>
                                        <div>
                                            <small className="text-muted d-block">Mode</small>
                                            <strong>Online</strong>
                                        </div>
                                    </li>
                                </ul>

                                <hr />
                                <div className="d-grid gap-2">
                                    <a
                                        href={course.videoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-danger btn-lg d-flex align-items-center justify-content-center"
                                    >
                                        <i className="bi bi-youtube me-2"></i> Get Started
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <Link to="/" className="text-decoration-none">
                        <i className="bi bi-arrow-left"></i> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CourseDetail;
