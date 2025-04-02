import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onBackdropClick?: () => void;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, onBackdropClick, closeSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handler for navigation that also closes sidebar
  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? "visible" : ""}`}
        onClick={onBackdropClick}
      ></div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <nav className="sidebar-menu">
            <div
              className={`sidebar-link ${
                location.pathname === "/" ? "active" : ""
              }`}
              onClick={() => handleNavigation("/")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="sidebar-link-text">Home</span>
            </div>
            <div
              className={`sidebar-link ${
                location.pathname === "/test-case-generator" ? "active" : ""
              }`}
              onClick={() => handleNavigation("/test-case-generator")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span className="sidebar-link-text">Test Case Generator</span>
            </div>
            <div
              className={`sidebar-link ${
                location.pathname === "/resume-screening" ? "active" : ""
              }`}
              onClick={() => handleNavigation("/resume-screening")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="sidebar-link-text">Resume Screening</span>
            </div>
            {/* Removed Chat with Maggi link as it's now a component */}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
