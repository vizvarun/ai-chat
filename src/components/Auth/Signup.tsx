import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Auth.css";
import MagnitLogo from "../../assets/magnit-logo.svg";

const Signup = () => {
  const [name, setName] = useState("");
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { signup, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    // Validate email username
    if (!emailUsername) {
      setEmailError("Email username is required");
      isValid = false;
    } else if (/\s/.test(emailUsername) || /[@]/.test(emailUsername)) {
      setEmailError("Username cannot contain spaces or @ symbols");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    // Combine username with domain
    const fullEmail = `${emailUsername}@magnitglobal.com`;

    try {
      await signup(name, fullEmail, password);
      navigate("/");
    } catch (err) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={MagnitLogo} alt="Magnit Logo" className="auth-logo" />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={loading}
              className={nameError ? "input-error" : ""}
            />
            {nameError && <div className="error-message">{nameError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="email-input-container">
              <input
                id="email"
                type="text"
                value={emailUsername}
                onChange={(e) => setEmailUsername(e.target.value)}
                placeholder="username"
                disabled={loading}
                className={emailError ? "input-error" : ""}
              />
              <div className="email-domain">@magnitglobal.com</div>
            </div>
            {emailError && <div className="error-message">{emailError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              disabled={loading}
              className={passwordError ? "input-error" : ""}
            />
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
              className={confirmPasswordError ? "input-error" : ""}
            />
            {confirmPasswordError && (
              <div className="error-message">{confirmPasswordError}</div>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
