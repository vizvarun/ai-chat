import { useNavigate, useLocation } from "react-router-dom";
import React from "react"; // Add import for React
import "../styles/Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onBackdropClick?: () => void;
  closeSidebar: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode; // Changed from JSX.Element to React.ReactNode
}

// Sidebar Link Component
const SidebarLink = ({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`sidebar-link ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {item.icon}
      <span className="sidebar-link-text">{item.label}</span>
    </div>
  );
};

const Sidebar = ({ isOpen, onBackdropClick, closeSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handler for navigation that also closes sidebar
  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  // Navigation configuration
  const navigationItems: NavItem[] = [
    {
      path: "/",
      label: "Home",
      icon: (
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
      ),
    },
    {
      path: "/test-case-generator",
      label: "Test Case Generator",
      icon: (
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
      ),
    },
    {
      path: "/resume-screener",
      label: "Resume Screener",
      icon: (
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
      ),
    },
  ];

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? "visible" : ""}`}
        onClick={onBackdropClick}
      ></div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <nav className="sidebar-menu">
            {navigationItems.map((item) => (
              <SidebarLink
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
