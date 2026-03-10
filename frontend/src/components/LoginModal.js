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

      const userRole = res.data.user.role;

      // Allow jobseekers and admins
      if (userRole !== "jobseeker" && userRole !== "admin") {
        alert("This login is for students & admins. Employers should use the Employer login page.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setRole(userRole);
      setUserName(res.data.user.firstName);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setTimeout(() => {
        navigate(userRole === "admin" ? "/admin" : "/jobs");
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const [newPassword, setNewPassword] = useState("");
  const [otpMsg, setOtpMsg] = useState("");

  const handleSendOTP = async () => {
    if (!email) { alert("Please enter your registered email"); return; }
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      setStep("otp");
      setOtpMsg("OTP sent! Check your email inbox.");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !newPassword) { alert("Enter OTP and new password"); return; }
    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { email, otp, newPassword });
      setStep("resetSuccess");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
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

          <div className="modal-body p-1">

            {/* LOGIN FORM */}
            {step === "login" && !success && (
              <>
                <div className="modal-header-custom">
                  <h3>Welcome Back</h3>
                  <p>Log in to Job Portal to continue your journey</p>
                </div>

                <div className="mb-3">
                  <label><i className="bi bi-envelope-fill text-muted me-2"></i>Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-login"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label><i className="bi bi-lock-fill text-muted me-2"></i>Password</label>
                  <input
                    type="password"
                    className="form-control form-control-login"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>


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
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</>
                  ) : (
                    <><i className="bi bi-box-arrow-in-right me-2"></i>Login</>
                  )}
                </button>


                <p className="register-text">
                  New to Job Portal? Register{" "}
                  <Link
                    to="/signup"
                    onClick={() => {
                      const closeBtn = document.querySelector('#loginModal .btn-close');
                      if (closeBtn) closeBtn.click();
                    }}
                  >
                    <span>Jobseeker</span>
                  </Link>
                </p>
              </>
            )}

            {/* FORGOT PASSWORD – EMAIL */}
            {step === "forgot" && (
              <>
                <div className="modal-header-custom">
                  <h3>Reset Password</h3>
                  <p>Enter your email to receive an OTP</p>
                </div>

                <div className="mb-4">
                  <input
                    type="email"
                    className="form-control form-control-login"
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button className="btn login-submit-btn" onClick={handleSendOTP} disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : "Send OTP"}
                </button>
                <div className="text-center mt-3">
                  <span className="text-primary" style={{ cursor: 'pointer', fontWeight: '600' }} onClick={() => setStep("login")}>Back to login</span>
                </div>
              </>
            )}

            {/* OTP VERIFICATION */}
            {step === "otp" && (
              <>
                <div className="modal-header-custom">
                  <h3>Verify OTP</h3>
                  <p>Check your email for the code</p>
                </div>

                {otpMsg && <div className="alert alert-success py-2 text-center small mb-3">{otpMsg}</div>}

                <div className="mb-3">
                  <input
                    className="form-control form-control-login text-center letter-spacing-2"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control form-control-login"
                    placeholder="New Password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <button className="btn login-submit-btn" onClick={handleVerifyOTP} disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : "Verify OTP & Reset"}
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
