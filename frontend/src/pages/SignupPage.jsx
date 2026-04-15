import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import "../pages/SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.fullName.trim(),
          role: formData.role,
        }),
      });

      const data = await response.json();
      console.log("Registration response:", { status: response.status, data });

      if (!response.ok) {
        const errorMsg = data?.message || data?.error || "Registration failed. Please try again.";
        console.error("Registration error:", errorMsg);
        setServerError(errorMsg);
        showToast(errorMsg, "error");
        return;
      }

      // Auto-login user
      if (data.user) {
        login(data.user.email, data.user.role, data.user.name);
        showToast(`Welcome, ${data.user.name}!`, "success");

        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.message || "An error occurred during registration. Please check the console and try again.";
      setServerError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join BookNest and start exploring</p>

          {serverError && <div className="error-banner">{serverError}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={errors.email ? "input-error" : ""}
                disabled={isLoading}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Full Name Field */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.fullName ? "input-error" : ""}
                disabled={isLoading}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={errors.password ? "input-error" : ""}
                disabled={isLoading}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
              <p className="password-hint">Minimum 8 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={errors.confirmPassword ? "input-error" : ""}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label>Account Type</label>
              <div className="role-selector">
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === "user"}
                    onChange={() => handleRoleChange("user")}
                    disabled={isLoading}
                  />
                  <span className="role-label">
                    <span className="role-title">Reader</span>
                    <span className="role-description">Browse and purchase books</span>
                  </span>
                </label>

                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={() => handleRoleChange("admin")}
                    disabled={isLoading}
                  />
                  <span className="role-label">
                    <span className="role-title">Admin</span>
                    <span className="role-description">Manage inventory and orders</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="login-link-section">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
