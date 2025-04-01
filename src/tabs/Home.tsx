import { useNavigate } from "react-router-dom";
import "../styles/Tabs.css";
import "../styles/Home.css";
import Breadcrumbs from "../components/Breadcrumbs";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="tab-container home-container">
      <Breadcrumbs />
      <div className="home-content-wrapper">
        <section className="hero-section">
          <h1 className="hero-title">MockingBird</h1>
          <p className="hero-subtitle">
            Intelligent AI-powered testing assistant that streamlines your test
            case creation and management workflow
          </p>
        </section>
        <div className="home-content">
          <section className="tools-section">
            <div className="tools-grid">
              <div
                className="tool-card"
                onClick={() => navigate("/test-case-generator")}
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
              <div
                className="tool-card"
                onClick={() => navigate("/chat-with-maggi")}
                aria-label="Chat with Maggi"
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h2 className="tool-title">Chat with Maggi</h2>
                <p className="tool-description">
                  Get interactive help with testing scenarios and real-time
                  guidance from our AI assistant
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Interactive Chat</h3>
                <p className="feature-description">
                  Get real-time guidance and answers from our intelligent
                  testing assistant
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
                    <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
                  </svg>
                </div>
                <h3 className="feature-title">Voice Interactions</h3>
                <p className="feature-description">
                  Hands-free operation with voice recognition for efficient
                  workflow
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
