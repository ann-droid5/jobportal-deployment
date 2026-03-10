import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import api from "../api/axios";
import signupBg from "../assets/signup_bg.png";

function Signup({ setRole }) {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !firstName || !lastName) {
      alert("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/signup", {
        email,
        password,
        firstName,
        lastName,
      });
      setRole(res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${signupBg})` }}>
      <div className="signup-container">
        <h1 className="signup-title">
          Sign-up and <span>apply for free</span>
        </h1>
        <p className="signup-subtitle">
          3,00,000+ companies hiring on Job Portal
        </p>

        <div className="signup-card">
          <h5 className="text-center mb-3">Candidate sign up</h5>

          {!success ? (
            <>
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Must be at least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="signup-btn"
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </>
          ) : (
            <div className="alert alert-success text-center">
              ✅ Registered successfully <br />
              📧 A welcome email has been sent to your inbox!
            </div>
          )}

          <p className="terms-text">
            By continuing as a candidate, you agree to our{" "}
            <a href="/">T&C</a>.
          </p>

          <p className="login-text">
            Already registered?{" "}
            <span
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
              style={{ color: "#00a5ec", fontWeight: 500, cursor: "pointer" }}
            >
              Login
            </span>
          </p>
        </div>

        <div className="employer-signup">
          <a href="/">Employer sign up →</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
