import React from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../data/courses';

function HomeCoursesSection() {
    return (
        <div className="py-5" style={{ background: "linear-gradient(to bottom, #ffffff, #f0f4f8)" }}>
            <div className="container position-relative">
                <style>
                    {`
                    .course-card {
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        border: none;
                        min-width: 280px; /* Ensure cards have width in flex container */
                    }
                    .course-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
                    }
                    .course-badge {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: rgba(0,0,0,0.6);
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 0.8rem;
                    }
                    .courses-slider {
                        display: flex;
                        overflow-x: auto;
                        scroll-behavior: smooth;
                        gap: 20px;
                        padding: 20px 5px; /* Padding for hover effect */
                        scrollbar-width: none; /* Firefox */
                    }
                    .courses-slider::-webkit-scrollbar {
                        display: none; /* Chrome/Safari */
                    }
                    .scroll-btn {
                        position: absolute;
                        top: 55%;
                        transform: translateY(-50%);
                        z-index: 10;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: white;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        border: 1px solid #eee;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .scroll-btn:hover {
                        background: #f8f9fa;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    }
                    .scroll-left { left: -15px; }
                    .scroll-right { right: -15px; }
                `}
                </style>

                <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                    <h2 className="fw-bold m-0">Explore Our Courses</h2>
                    <Link to="/courses/full-stack-web-development" className="text-decoration-none fw-bold">View all courses <i className="bi bi-arrow-right"></i></Link>
                </div>

                <div className="position-relative">
                    <button
                        className="scroll-btn scroll-left"
                        onClick={() => document.querySelector('.courses-slider').scrollBy({ left: -300, behavior: 'smooth' })}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>

                    <div className="courses-slider">
                        {courses.map(course => (
                            <div key={course.id} className="col-10 col-md-4 col-lg-3" style={{ flex: "0 0 auto" }}>
                                <div className="card h-100 shadow-sm course-card overflow-hidden">
                                    <div className="position-relative">
                                        <img src={course.image} className="card-img-top" alt={course.title} style={{ height: "180px", objectFit: "cover" }} />
                                        <span className="course-badge">{course.duration}</span>
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-truncate fw-bold" title={course.title}>{course.title}</h5>
                                        <p className="card-text text-muted small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {course.description}
                                        </p>
                                        <Link to={`/courses/${course.slug}`} className="btn btn-primary btn-sm mt-3 stretched-link w-100">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="scroll-btn scroll-right"
                        onClick={() => document.querySelector('.courses-slider').scrollBy({ left: 300, behavior: 'smooth' })}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomeCoursesSection;
