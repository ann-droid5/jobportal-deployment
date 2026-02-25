import React from 'react';
import { Link } from 'react-router-dom';

function FullStack() {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <h1 className="display-4 mb-4">Full Stack Development</h1>
                    <img
                        src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                        alt="Full Stack Development"
                        className="img-fluid rounded mb-4 shadow"
                    />

                    <h3>Course Overview</h3>
                    <p className="lead">
                        Master both frontend and backend development with this comprehensive course.
                        Learn to build complete web applications from scratch using modern technologies like React, Node.js, Express, and MongoDB.
                    </p>

                    <hr className="my-4" />

                    <h4>What you'll learn</h4>
                    <ul className="list-group list-group-flush mb-4">
                        <li className="list-group-item">Frontend: HTML, CSS, JavaScript, React.js</li>
                        <li className="list-group-item">Backend: Node.js, Express.js</li>
                        <li className="list-group-item">Database: MongoDB, SQL</li>
                        <li className="list-group-item">Version Control: Git & GitHub</li>
                        <li className="list-group-item">Deployment: Cloud hosting (AWS/Heroku/Vercel)</li>
                    </ul>

                    <div className="alert alert-info">
                        <strong>Duration:</strong> 6 Months <br />
                        <strong>Mode:</strong> Online / Offline
                    </div>

                    <Link to="/" className="btn btn-primary btn-lg mt-3">Enquire Now</Link>
                </div>
            </div>
        </div>
    );
}

export default FullStack;
