import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "./EmployerSignup.css";

function EmployerSignup({ setRole }) {
    const navigate = useNavigate();
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmployerRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/signup", {
                email,
                password,
                firstName: company,
                lastName: "(Employer)",
                role: "employer",
                company: company
            });

            setRole("employer");
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Redirect to dashboard
            navigate("/employer");

        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employer-signup-container">
            {/* Left Side - Branding */}
            <div className="employer-signup-left">
                <div className="brand-wrapper">
                    <h1>Hire the best talent directly.</h1>
                </div>
                <ul className="benefits-list">
                    <li>
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Post jobs for free and find candidates</span>
                    </li>
                    <li>
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Access a database of 10M+ students</span>
                    </li>
                    <li>
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Seamless applicant tracking system</span>
                    </li>
                    <li>
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Verify your company instantly</span>
                    </li>
                </ul>
            </div>

            {/* Right Side - Form */}
            <div className="employer-signup-right">
                <div className="signup-form-wrapper">
                    <h2>Employer Sign Up</h2>
                    <p className="signup-subtitle">Start hiring in minutes</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleEmployerRegister}>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input
                                type="text"
                                className="form-control-custom"
                                placeholder="e.g. Google, Amazon"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Official Email</label>
                            <input
                                type="email"
                                className="form-control-custom"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control-custom"
                                placeholder="6+ characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="btn-signup-custom" disabled={loading}>
                            {loading ? "Creating Account..." : "Post a Job for Free"}
                        </button>
                    </form>

                    <div className="login-link">
                        Already have an account? <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => {
                            const event = new CustomEvent('switchLoginTab', { detail: { tab: 'employer' } });
                            window.dispatchEvent(event);

                            const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
                            if (loginBtn) loginBtn.click();
                        }}>Login</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployerSignup;
