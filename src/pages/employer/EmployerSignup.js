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

    // Per-field validation errors
    const [fieldErrors, setFieldErrors] = useState({});

    const validateForm = () => {
        const errors = {};

        if (!company.trim()) {
            errors.company = "Company name is required.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            errors.email = "Email is required.";
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address.";
        }

        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEmployerRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

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

                    <form onSubmit={handleEmployerRegister} noValidate>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input
                                type="text"
                                className={`form-control-custom ${fieldErrors.company ? "input-error" : ""}`}
                                placeholder="e.g. Google, Amazon"
                                value={company}
                                onChange={(e) => {
                                    setCompany(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, company: "" }));
                                }}
                            />
                            {fieldErrors.company && (
                                <span className="field-error-msg">{fieldErrors.company}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Official Email</label>
                            <input
                                type="email"
                                className={`form-control-custom ${fieldErrors.email ? "input-error" : ""}`}
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, email: "" }));
                                }}
                            />
                            {fieldErrors.email && (
                                <span className="field-error-msg">{fieldErrors.email}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className={`form-control-custom ${fieldErrors.password ? "input-error" : ""}`}
                                placeholder="6+ characters"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, password: "" }));
                                }}
                            />
                            {fieldErrors.password && (
                                <span className="field-error-msg">{fieldErrors.password}</span>
                            )}
                        </div>

                        <button type="submit" className="btn-signup-custom" disabled={loading}>
                            {loading ? "Creating Account..." : "Post a Job for Free"}
                        </button>
                    </form>

                    <div className="login-link mt-4 text-center">
                        Already have an account? <Link to="/employer/login" className="text-primary fw-bold text-decoration-none">Login Here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployerSignup;

