import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import { useToast } from "../../context/ToastContext";

function EmployerOnboarding() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        website: "",
        location: "",
        industry: "",
        description: "",
        registrationId: "",
        size: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Assuming we repurpose an existing update endpoint or create a new one
            // We will use the user update endpoint: PUT /users/:id
            const user = JSON.parse(localStorage.getItem("user"));

            await api.put(`/users/${user._id}`, {
                companyDetails: formData
            });

            // Update local storage user with new details (optional, but good for immediate UI updates)
            const updatedUser = { ...user, companyDetails: formData };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            addToast("success", "Profile updated! Awaiting admin verification.");
            navigate("/employer");
        } catch (err) {
            console.error(err);
            addToast("error", "Failed to save details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 pb-5" style={{ maxWidth: "600px" }}>
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h2 className="mb-3 text-center">Complete Your Company Profile</h2>
                    <p className="text-muted text-center mb-4">
                        To ensure the quality of jobs on our platform, we require some additional details for verification.
                    </p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Company Website</label>
                            <input
                                type="url"
                                className="form-control"
                                name="website"
                                placeholder="https://example.com"
                                value={formData.website}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Headquarters Location</label>
                            <input
                                type="text"
                                className="form-control"
                                name="location"
                                placeholder="e.g. San Francisco, CA"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Industry</label>
                            <select
                                className="form-select"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Industry</option>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Retail">Retail</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Registration ID / Tax No.</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="registrationId"
                                    placeholder="e.g. CIN12345678"
                                    value={formData.registrationId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Company Size</label>
                                <select
                                    className="form-select"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Size</option>
                                    <option value="1-10">1-10 Employees</option>
                                    <option value="11-50">11-50 Employees</option>
                                    <option value="51-200">51-200 Employees</option>
                                    <option value="200+">200+ Employees</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Company Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                rows="4"
                                placeholder="Tell us about your company culture and values..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Saving..." : "Submit for Verification"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EmployerOnboarding;
