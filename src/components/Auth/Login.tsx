import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Auth.css";
import MagnitLogo from "../../assets/magnit-logo.svg";

const Login = () => {
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the origin path from state or default to home
  const from = (location.state as any)?.from?.pathname || "/";

  const validateEmail = (username: string) => {
    if (!username) {
      setEmailError("Email username is required");
      return false;
    }

    // Basic validation for username format
    if (/\s/.test(username) || /[@]/.test(username)) {
      setEmailError("Username cannot contain spaces or @ symbols");
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateEmail(emailUsername)) {
      return;
    }

    if (!password) {
      return;
    }

    // Combine username with domain
    const fullEmail = `${emailUsername}@magnitglobal.com`;

    try {
      await login(fullEmail, password);
      navigate(from, { replace: true });
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
            <label htmlFor="email">Email Address</label>
            <div className="email-input-container">
              <input
                id="email"
                type="text"
                value={emailUsername}
                onChange={(e) => {
                  setEmailUsername(e.target.value);
                  validateEmail(e.target.value);
                }}
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
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
