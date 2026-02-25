import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import "./AdminLogin.css";

function AdminLogin({ setRole }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("error", "Please enter credentials");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setRole("admin");
      addToast("success", "Welcome back, Admin!");
      navigate("/admin");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="al-wrapper">
      {/* ── Left panel – illustration ── */}
      <div className="al-left">
        <div className="al-left-brand">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="white" fillOpacity="0.25" />
            <path d="M7 14l5 5 9-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>JobPortal Admin</span>
        </div>

        {/* SVG illustration */}
        <div className="al-illustration">
          <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background blobs */}
            <ellipse cx="260" cy="340" rx="200" ry="60" fill="white" fillOpacity="0.08" />
            <circle cx="80" cy="100" r="60" fill="white" fillOpacity="0.07" />
            <circle cx="430" cy="80" r="40" fill="white" fillOpacity="0.07" />

            {/* Desk */}
            <rect x="100" y="290" width="320" height="12" rx="6" fill="white" fillOpacity="0.25" />
            <rect x="150" y="302" width="16" height="60" rx="4" fill="white" fillOpacity="0.2" />
            <rect x="354" y="302" width="16" height="60" rx="4" fill="white" fillOpacity="0.2" />

            {/* Monitor */}
            <rect x="190" y="190" width="160" height="100" rx="8" fill="white" fillOpacity="0.2" />
            <rect x="198" y="198" width="144" height="84" rx="5" fill="white" fillOpacity="0.15" />
            <rect x="252" y="290" width="36" height="10" rx="2" fill="white" fillOpacity="0.2" />
            <rect x="238" y="298" width="64" height="6" rx="3" fill="white" fillOpacity="0.18" />

            {/* Screen content lines */}
            <rect x="210" y="212" width="80" height="7" rx="3" fill="white" fillOpacity="0.4" />
            <rect x="210" y="226" width="120" height="5" rx="2.5" fill="white" fillOpacity="0.25" />
            <rect x="210" y="237" width="100" height="5" rx="2.5" fill="white" fillOpacity="0.25" />
            <rect x="210" y="248" width="90" height="5" rx="2.5" fill="white" fillOpacity="0.25" />
            <rect x="210" y="262" width="50" height="14" rx="4" fill="white" fillOpacity="0.3" />

            {/* Person body */}
            <ellipse cx="185" cy="275" rx="30" ry="15" fill="white" fillOpacity="0.12" />
            <circle cx="185" cy="218" r="22" fill="white" fillOpacity="0.22" />
            {/* Face */}
            <circle cx="185" cy="218" r="18" fill="#FFDDB0" />
            <ellipse cx="179" cy="217" rx="3" ry="3.5" fill="#1e293b" fillOpacity="0.6" />
            <ellipse cx="191" cy="217" rx="3" ry="3.5" fill="#1e293b" fillOpacity="0.6" />
            <path d="M180 225 Q185 229 190 225" stroke="#1e293b" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
            {/* Hair */}
            <path d="M167 212 Q170 200 185 199 Q200 200 203 212" fill="#2d2d2d" />
            {/* Suit */}
            <path d="M158 290 Q162 245 185 240 Q208 245 212 290Z" fill="#2563eb" fillOpacity="0.7" />
            <path d="M182 240 L185 252 L188 240" fill="white" fillOpacity="0.5" />
            {/* Tie */}
            <path d="M185 248 L182 265 L185 270 L188 265Z" fill="#f97316" fillOpacity="0.8" />
            {/* Arms */}
            <path d="M158 250 Q140 265 150 285" stroke="#FFDDB0" strokeWidth="12" strokeLinecap="round" />
            <path d="M212 250 Q225 260 220 280" stroke="#FFDDB0" strokeWidth="12" strokeLinecap="round" />
            {/* Hand on keyboard */}
            <ellipse cx="222" cy="284" rx="12" ry="8" fill="#FFDDB0" />

            {/* Keyboard */}
            <rect x="155" y="285" width="80" height="12" rx="4" fill="white" fillOpacity="0.22" />

            {/* Floating chat bubble */}
            <rect x="220" y="160" width="80" height="36" rx="10" fill="white" fillOpacity="0.3" />
            <path d="M230 196 L225 206 L242 196" fill="white" fillOpacity="0.3" />
            <circle cx="240" cy="178" r="5" fill="white" fillOpacity="0.6" />
            <circle cx="260" cy="178" r="5" fill="white" fillOpacity="0.6" />
            <circle cx="280" cy="178" r="5" fill="white" fillOpacity="0.6" />

            {/* Small floating cards */}
            <rect x="52" y="170" width="72" height="46" rx="8" fill="white" fillOpacity="0.18" />
            <rect x="60" y="180" width="40" height="5" rx="2" fill="white" fillOpacity="0.5" />
            <rect x="60" y="190" width="55" height="4" rx="2" fill="white" fillOpacity="0.35" />
            <rect x="60" y="199" width="48" height="4" rx="2" fill="white" fillOpacity="0.35" />

            <rect x="390" y="200" width="72" height="46" rx="8" fill="white" fillOpacity="0.18" />
            <rect x="398" y="210" width="40" height="5" rx="2" fill="white" fillOpacity="0.5" />
            <rect x="398" y="220" width="55" height="4" rx="2" fill="white" fillOpacity="0.35" />
            <circle cx="442" cy="232" r="6" fill="white" fillOpacity="0.4" />
          </svg>
        </div>

        <div className="al-left-text">
          <h2>Manage Everything in One Place</h2>
          <p>Access your admin dashboard to manage jobs, users, and applications seamlessly.</p>
        </div>

        {/* Decorative dots */}
        <div className="al-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* ── Right panel – form ── */}
      <div className="al-right">
        <div className="al-form-container">
          <div className="al-form-header">
            <div className="al-badge">ADMIN PORTAL</div>
            <h1>Login</h1>
            <p>Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="al-form">
            {/* Email */}
            <div className="al-field">
              <input
                type="email"
                id="admin-email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
              <span className="al-field-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </div>

            {/* Password */}
            <div className="al-field">
              <input
                type={showPassword ? "text" : "password"}
                id="admin-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="al-field-icon al-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="al-forgot-row">
              <a href="#" className="al-forgot">Forgot Password?</a>
            </div>

            <button type="submit" className="al-submit-btn" disabled={loading}>
              {loading ? <span className="al-loader"></span> : "Login"}
            </button>
          </form>

          <div className="al-form-footer">
            <Link to="/">← Back to Main Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;