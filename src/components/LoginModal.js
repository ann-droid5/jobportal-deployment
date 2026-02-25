import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginModal.css";
import api from "../api/axios";

function LoginModal({ setRole }) {
  const [activeTab, setActiveTab] = useState("student"); // student | employer
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(""); // For success message

  // Listen for external tab switch events
  useEffect(() => {
    const handleTabSwitch = (event) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };

    window.addEventListener('switchLoginTab', handleTabSwitch);
    return () => window.removeEventListener('switchLoginTab', handleTabSwitch);
  }, []);

  // Reset modal state when it is closed (fixes stale "Welcome" after logout)
  useEffect(() => {
    const modalEl = document.getElementById('loginModal');
    if (!modalEl) return;

    const handleHidden = () => {
      setSuccess(false);
      setUserName("");
      setEmail("");
      setPassword("");
      setStep("login");
      setActiveTab("student");
      setOtp("");
    };

    modalEl.addEventListener('hidden.bs.modal', handleHidden);
    return () => modalEl.removeEventListener('hidden.bs.modal', handleHidden);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      setSuccess(true);
      setRole(res.data.user.role);
      setUserName(res.data.user.firstName);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setTimeout(() => {
        navigate(res.data.user.role === "jobseeker" ? "/jobs" : "/employer");
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    setSuccess(true);
    setRole(activeTab === "student" ? "jobseeker" : "employer");

    console.log(`Google login successful for ${activeTab}`);

    setTimeout(() => {
      navigate(activeTab === "student" ? "/jobs" : "/employer");
    }, 1500);
  };
  const handleSendOTP = () => {
    console.log(`
    📧 OTP SENT
    To: ${email}
    OTP: 123456
  `);
    setStep("otp");
  };

  const handleVerifyOTP = () => {
    if (otp === "123456") {
      setStep("resetSuccess");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="modal fade" id="loginModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content login-modal">

          <button
            className="btn-close login-close"
            data-bs-dismiss="modal"
          ></button>

          <div className="login-tabs">
            <span
              className={activeTab === "student" ? "active" : ""}
              onClick={() => setActiveTab("student")}
            >
              Student
            </span>
            <span
              className={activeTab === "employer" ? "active" : ""}
              onClick={() => setActiveTab("employer")}
            >
              Employer / T&P
            </span>
          </div>

          <div className="modal-body">

            {/* LOGIN FORM */}
            {step === "login" && !success && (
              <>
                <button className="google-login-btn" onClick={handleGoogleLogin}>
                  <img
                    src="https://img.icons8.com/color/20/google-logo.png"
                    alt="google"
                  />
                  Login with Google
                </button>

                <div className="divider"><span>OR</span></div>

                <label>Email</label>
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label>Password</label>
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />


                <div
                  className="forgot-password"
                  onClick={() => setStep("forgot")}
                >
                  Forgot password?
                </div>

                <button
                  className="btn login-submit-btn"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>


                <p className="register-text">
                  New to Internshala? Register{" "}
                  <Link to="/signup"><span>Student / Company</span></Link>
                </p>
              </>
            )}

            {/* FORGOT PASSWORD – EMAIL */}
            {step === "forgot" && (
              <>
                <h6 className="text-center mb-3">Reset Password</h6>

                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Enter registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button className="btn login-submit-btn" onClick={handleSendOTP}>
                  Send OTP
                </button>
              </>
            )}

            {/* OTP VERIFICATION */}
            {step === "otp" && (
              <>
                <h6 className="text-center mb-3">Verify OTP</h6>

                <input
                  className="form-control mb-3"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="New Password"
                />

                <button className="btn login-submit-btn" onClick={handleVerifyOTP}>
                  Verify OTP & Reset
                </button>
              </>
            )}

            {/* RESET SUCCESS */}
            {step === "resetSuccess" && (
              <div className="alert alert-success text-center">
                ✅ Password reset successful <br />
                Please login again
              </div>
            )}

            {/* LOGIN SUCCESS */}
            {success && (
              <div className="success-view">
                <div className="success-icon-container">
                  <i className="bi bi-check-lg"></i>
                </div>
                <h3>Welcome back, {userName || "User"}!</h3>
                <p>Redirecting you to dashboard...</p>
              </div>
            )}

          </div>


        </div>
      </div>
    </div>
  );
}

export default LoginModal;
