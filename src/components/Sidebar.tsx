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
                location.pathname === "/chat-with-maggi" ? "active" : ""
              }`}
              onClick={() => handleNavigation("/chat-with-maggi")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="sidebar-link-text">Chat with Maggi</span>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
