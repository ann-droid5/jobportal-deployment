import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterModal({ setRole }) {
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState("register"); 
  // register | otp | success

  const navigate = useNavigate();

  const handleRegister = () => {
    setSuccess(true);
    setRole("jobseeker");

    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };

  const handleSendOTP = () => {
    setStep("otp");
  };

  const handleVerifyOTP = () => {
    setStep("register");
    alert("Password reset successful (UI only)");
  };

  return (
    <div className="modal fade" id="registerModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Job Seeker Registration</h5>
            <button className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">

            {/* REGISTER FORM */}
            {!success && step === "register" && (
              <>
                <input className="form-control mb-2" placeholder="Full Name" />
                <input className="form-control mb-2" placeholder="Email" />
                <input className="form-control mb-2" type="password" placeholder="Password" />
                <input className="form-control mb-3" type="password" placeholder="Confirm Password" />

                <button
                  className="btn btn-success w-100"
                  onClick={handleRegister}
                >
                  Register
                </button>

                <p
                  className="text-primary text-center mt-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleSendOTP}
                >
                  Forgot Password?
                </p>
              </>
            )}

            {/* OTP RESET */}
            {step === "otp" && (
              <>
                <input className="form-control mb-2" placeholder="Enter OTP" />
                <input className="form-control mb-3" type="password" placeholder="New Password" />

                <button
                  className="btn btn-primary w-100"
                  onClick={handleVerifyOTP}
                >
                  Verify OTP & Reset
                </button>
              </>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="alert alert-success text-center">
                Registered successfully
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
