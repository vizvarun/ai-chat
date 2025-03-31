import React from "react";
import "../styles/Loader.css";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "medium", className = "" }) => {
  return (
    <div className={`loader-container ${size} ${className}`}>
      <div className="animated-loader">
        <div className="loader-dot primary"></div>
        <div className="loader-dot secondary"></div>
        <div className="loader-dot primary"></div>
      </div>
    </div>
  );
};

export default Loader;
