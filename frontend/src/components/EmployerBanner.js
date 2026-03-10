import React from 'react';
import { Link } from 'react-router-dom';

const EmployerBanner = () => {
    return (
        <section className="employer-banner-section py-4">
            <style>
                {`
                    .employer-banner-section {
                        background: linear-gradient(135deg, #0066cc, #004494);
                        color: white;
                        position: relative;
                        overflow: hidden;
                    }
                    .employer-banner-content {
                        position: relative;
                        z-index: 2;
                        padding-left: 2rem; /* Adjusted padding */
                    }
                    .employer-tag {
                        background: rgba(255, 255, 255, 0.2);
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 4px;
                        font-weight: 600;
                        font-size: 0.75rem;
                        letter-spacing: 1px;
                        margin-bottom: 12px;
                        text-transform: uppercase;
                    }
                    /* Compact heading and text */
                    .banner-heading {
                        font-size: 1.8rem;
                        font-weight: 700;
                        margin-bottom: 0.8rem;
                        line-height: 1.2;
                    }
                    .banner-text {
                        font-size: 1rem;
                        margin-bottom: 1.2rem;
                        opacity: 0.85;
                        max-width: 90%;
                    }

                    .employer-image-container {
                        position: relative;
                        height: 250px; /* Fixed height to match card section */
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .employer-image {
                        border-radius: 10px;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
                        transform: perspective(1000px) rotateY(-5deg);
                        transition: transform 0.5s ease;
                        height: 100%;
                        width: auto;
                        max-width: 100%;
                        object-fit: cover;
                    }
                    .employer-image:hover {
                        transform: perspective(1000px) rotateY(0deg);
                    }
                    
                    /* Adjusted floating cards for smaller size */
                    .floating-card {
                        position: absolute;
                        background: white;
                        color: #333;
                        padding: 8px 12px;
                        border-radius: 6px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.15);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-weight: 600;
                        font-size: 0.75rem;
                        animation: float 4s ease-in-out infinite;
                        z-index: 3;
                    }
                    .fc-1 { top: 10px; right: 10%; }
                    .fc-2 { bottom: 20px; left: 10%; animation-delay: 2s; }

                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-6px); }
                        100% { transform: translateY(0px); }
                    }

                    .btn-hire {
                        background-color: #ffcc00;
                        color: #004494;
                        font-weight: 700;
                        padding: 8px 20px;
                        font-size: 0.95rem;
                        border: none;
                        border-radius: 5px;
                        transition: all 0.3s;
                    }
                    .btn-hire:hover {
                        background-color: #e6b800;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    }
                    
                    @media (max-width: 768px) {
                        .employer-image-container {
                            height: 200px;
                            margin-top: 20px;
                        }
                        .banner-heading { font-size: 1.5rem; }
                        .employer-banner-content { padding-left: 1rem; text-align: center; }
                        .banner-text { margin-left: auto; margin-right: auto; }
                        .d-flex.gap-3 { justify-content: center; }
                    }
                `}
            </style>
            <div className="container">
                <div className="row align-items-center">

                    {/* Content Side */}
                    <div className="col-md-6 order-md-2">
                        <div className="employer-banner-content">
                            <div className="employer-tag">
                                Internshala for Employers
                            </div>
                            <h2 className="banner-heading">
                                Looking to hire freshers?
                            </h2>
                            <p className="banner-text">
                                Hire the perfect match from India's largest talent pool.
                            </p>

                            <div className="d-flex gap-3">
                                <Link to="/employer/signup" className="btn btn-hire">
                                    Post now for free <i className="bi bi-arrow-right ms-2"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="col-md-6 order-md-1">
                        <div className="employer-image-container">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Hiring Manager"
                                className="img-fluid employer-image"
                            />

                            {/* Floating UI Elements */}
                            <div className="floating-card fc-1 d-none d-lg-flex">
                                <div className="bg-success rounded-circle p-1 text-white">
                                    <i className="bi bi-check-lg"></i>
                                </div>
                                <div>
                                    <div className="text-success">98% Match</div>
                                </div>
                            </div>

                            <div className="floating-card fc-2 d-none d-lg-flex">
                                <div className="bg-primary rounded-circle p-1 text-white">
                                    <i className="bi bi-people-fill"></i>
                                </div>
                                <div>
                                    <div className="text-primary">10k+ Active</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default EmployerBanner;
