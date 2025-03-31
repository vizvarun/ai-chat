import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import MagnitLogo from "../assets/magnit-logo.svg"; // Adjust the path as necessary

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link">
          <div className="brand-content">
            <img src={MagnitLogo} alt="Magnit Logo" className="magnit-logo" />
            <span className="divider">|</span>
            <span className="app-name">MockingBird</span>
          </div>
        </NavLink>
      </div>
      <div className="nav-links">
        <NavLink
          to="/test-case-generator"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Test Case Generator
        </NavLink>
        <NavLink
          to="/chat-with-maggi"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Chat with Maggi
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
