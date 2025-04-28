import React from "react";
import "../styles/FeatureLock.css";

interface FeatureLockProps {
  children: React.ReactNode;
  isLocked: boolean;
  message?: string;
}

const FeatureLock: React.FC<FeatureLockProps> = ({
  children,
  isLocked,
  message = "You don't have access to this feature.",
}) => {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="feature-lock-container">
      {children}
      <div className="feature-lock-overlay">
        <div className="feature-lock-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <p className="feature-lock-message">{message}</p>
      </div>
    </div>
  );
};

export default FeatureLock;
