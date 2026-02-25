import React from 'react';
import { Link } from 'react-router-dom';

function Networks() {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <h1 className="display-4 mb-4">Networks & Communications</h1>
                    <img
                        src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Networks & Communications"
                        className="img-fluid rounded mb-4 shadow"
                    />

                    <h3>Course Overview</h3>
                    <p className="lead">
                        Dive deep into the world of computer networking. Understand how data travels across the globe,
                        learn about network security, protocols, and infrastructure management.
                    </p>

                    <hr className="my-4" />

                    <h4>What you'll learn</h4>
                    <ul className="list-group list-group-flush mb-4">
                        <li className="list-group-item">Network Fundamentals (OSI Model, TCP/IP)</li>
                        <li className="list-group-item">Routing & Switching (Cisco CCNA concepts)</li>
                        <li className="list-group-item">Network Security & Firewalls</li>
                        <li className="list-group-item">Wireless Networking</li>
                        <li className="list-group-item">Cloud Networking Basics</li>
                    </ul>

                    <div className="alert alert-info">
                        <strong>Duration:</strong> 4 Months <br />
                        <strong>Mode:</strong> Online / Offline
                    </div>

                    <Link to="/" className="btn btn-primary btn-lg mt-3">Enquire Now</Link>
                </div>
            </div>
        </div>
    );
}

export default Networks;
