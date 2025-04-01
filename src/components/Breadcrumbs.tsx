import { Link, useLocation } from "react-router-dom";
import "../styles/Breadcrumbs.css";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Skip breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  // Create more compact path names
  const formatPathname = (name: string): string => {
    if (name === "test-case-generator") return "Test Case Generator";
    if (name === "chat-with-maggi") return "Chat With Maggi";

    // Default formatting for other routes
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs-container">
      <ol className="breadcrumbs">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <li key={name} className="breadcrumb-item active">
              {formatPathname(name)}
            </li>
          ) : (
            <li key={name} className="breadcrumb-item">
              <Link to={routeTo}>{formatPathname(name)}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
