import { useNavigate } from "react-router-dom";
import "../styles/Tabs.css";
import "../styles/Home.css";
import mockingbirdLogo from "../assets/mockingbird.svg";
import Breadcrumbs from "../components/Breadcrumbs";
import { useAuth } from "../context/AuthContext";
import FeatureLock from "../components/FeatureLock";

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="tab-container home-container">
      <Breadcrumbs />
      <div className="home-content-wrapper">
        <section className="hero-section">
          <div className="hero-wrapper">
            <img
              src={mockingbirdLogo}
              alt="MockingBird Logo"
              className="hero-logo"
            />
            <h1 className="hero-title">Magnit AI Tools</h1>
          </div>
          <p className="hero-subtitle">
            Intelligent AI-powered testing assistant that streamlines your test
            case creation and management workflow
          </p>
        </section>
        <div className="home-content">
          <section className="tools-section">
            <div className="tools-grid">
              <FeatureLock isLocked={!user?.authorized}>
                <div
                  className="tool-card"
                  onClick={() =>
                    user?.authorized && navigate("/test-case-generator")
                  }
                  aria-label="Test Case Generator"
                >
                  <div className="tool-icon">
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
                  </div>
                  <h2 className="tool-title">Test Case Generator</h2>
                  <p className="tool-description">
                    Generate comprehensive test plans from requirements and user
                    stories with AI-powered analysis
                  </p>
                  <div className="tool-action">
                    Get started
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </FeatureLock>

              <div
                className="tool-card"
                onClick={() => navigate("/resume-screener")}
                aria-label="Resume Screener"
              >
                <div className="tool-icon">
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
                    <line x1="10" y1="9" x2="8" y2="9"></line>
                  </svg>
                </div>
                <h2 className="tool-title">Resume Screener</h2>
                <p className="tool-description">
                  Analyze resumes efficiently with AI to identify top candidates
                  based on skills, experience, and job requirements
                </p>
                <div className="tool-action">
                  Get started
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </section>
          <section className="features-section">
            <h2 className="section-title">Key Features</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="feature-title">AI-Powered Test Cases</h3>
                <p className="feature-description">
                  Generate comprehensive test scenarios from user stories with
                  complete coverage
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
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
                    <line x1="10" y1="9" x2="8" y2="9"></line>
                  </svg>
                </div>
                <h3 className="feature-title">Resume Analysis</h3>
                <p className="feature-description">
                  Quickly evaluate candidate profiles with AI-powered screening
                  to match job requirements
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
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
                </div>
                <h3 className="feature-title">Interactive AI Chat</h3>
                <p className="feature-description">
                  Get instant help and guidance with our interactive AI-based
                  chat assistant at any point in your workflow
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <h3 className="feature-title">Test Step Analysis</h3>
                <p className="feature-description">
                  Detailed AI analysis of test steps to identify edge cases and
                  improve coverage
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
