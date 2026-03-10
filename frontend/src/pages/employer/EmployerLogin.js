import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "./EmployerSignup.css"; // We can reuse the styling from Signup

function EmployerLogin({ setRole }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmployerLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            const userRole = res.data.user.role;

            if (userRole !== "employer") {
                setError("This account is not registered as an Employer.");
                setLoading(false);
                return;
            }

            setRole("employer");
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/employer");

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employer-signup-container">
            {/* Left Side - Branding */}
            <div className="employer-signup-left">
                <div className="brand-wrapper">
                    <h1>Welcome back to your hiring dashboard.</h1>
                </div>
                <ul className="benefits-list">
                    <li>
                        <i className="bi bi-briefcase-fill"></i>
                        <span>Manage your job postings</span>
                    </li>
                    <li>
                        <i className="bi bi-people-fill"></i>
                        <span>Review and contact applicants</span>
                    </li>
                    <li>
                        <i className="bi bi-graph-up"></i>
                        <span>Track your hiring metrics</span>
                    </li>
                </ul>
            </div>

            {/* Right Side - Form */}
            <div className="employer-signup-right">
                <div className="signup-form-wrapper">
                    <h2>Employer Login</h2>
                    <p className="signup-subtitle">Access your company account</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleEmployerLogin} noValidate>
                        <div className="form-group">
                            <label>Official Email</label>
                            <input
                                type="email"
                                className="form-control-custom"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control-custom"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-signup-custom" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="login-link mt-4 text-center">
                        Don't have an employer account? <Link to="/employer/signup" className="text-primary fw-bold text-decoration-none">Sign Up Here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployerLogin;
