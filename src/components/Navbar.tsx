import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import MagnitLogo from "../assets/magnit-logo.svg";
import UserMenu from "./UserMenu";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="sidebar-toggle" onClick={toggleSidebar}>
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
          className={isSidebarOpen ? "rotated" : ""}
        >
          {isSidebarOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </div>
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link">
          <div className="brand-content">
            <img src={MagnitLogo} alt="Magnit Logo" className="magnit-logo" />
          </div>
        </NavLink>
      </div>

      {/* Add the user menu on the right */}
      <div className="navbar-right">{isAuthenticated && <UserMenu />}</div>
    </nav>
  );
};

export default Navbar;
