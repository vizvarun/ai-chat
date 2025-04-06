import React, { useEffect, useState } from "react";
import { ResumeResultRow } from "../types/resumeTypes";
import "../styles/CandidateDetailModal.css"; // Import your CSS file for styling

interface CandidateDetailModalProps {
  candidate: ResumeResultRow;
  onClose: () => void;
  onViewParsedResume: (resume: string) => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
  onViewParsedResume,
}) => {
  // Animation states
  const [showContent, setShowContent] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  // Get initials from candidate name for the avatar
  const getInitials = (name: string = ""): string => {
    return name
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("");
  };

  // Calculate match score percentage and circle parameters
  const matchScore = candidate.matchScore || 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashArray = animateScore ? (matchScore / 100) * circumference : 0;
  const initials = getInitials(candidate.candidateName || "");

  // Get rank with fallback to ensure it's never 0 or undefined
  const candidateRank =
    candidate.rank && candidate.rank > 0 ? candidate.rank : 1;

  // Get color for match score based on value - with better visibility
  const getMatchScoreColor = () => {
    if (matchScore >= 80) return "var(--color-success)";
    if (matchScore >= 60) return "#f59e0b"; // Brighter amber for visibility
    return "#ef4444"; // Brighter red for visibility
  };

  // Get match score quality assessment
  const getMatchQuality = () => {
    if (matchScore >= 85) return "Excellent";
    if (matchScore >= 70) return "Strong";
    if (matchScore >= 55) return "Good";
    if (matchScore >= 40) return "Fair";
    return "Basic";
  };

  // Get color class based on match score
  const getMatchColorClass = () => {
    if (matchScore >= 85) return "excellent-match";
    if (matchScore >= 70) return "strong-match";
    if (matchScore >= 55) return "good-match";
    if (matchScore >= 40) return "fair-match";
    return "basic-match";
  };

  // Get match score category - simpler classifications
  const getMatchCategory = () => {
    if (matchScore >= 80) return "Strong";
    if (matchScore >= 60) return "Good";
    return "Basic";
  };

  // Trigger animations after component mount
  useEffect(() => {
    // Slight delay before showing content for smoother animation
    const contentTimer = setTimeout(() => setShowContent(true), 50);
    // Delay before animating score circle
    const scoreTimer = setTimeout(() => setAnimateScore(true), 300);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(scoreTimer);
    };
  }, []);

  // Stop propagation on modal content click to prevent closing
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="candidate-modal-overlay" onClick={onClose}>
      <div
        className={`candidate-modal-container ${showContent ? "visible" : ""}`}
        onClick={handleModalContentClick}
      >
        {/* Header section with candidate info and match score */}
        <div className="candidate-modal-header">
          {/* Candidate info on the left */}
          <div className="candidate-info">
            <div className="candidate-avatar">{initials}</div>
            <div className="candidate-header-details">
              <h2 className="candidate-title">
                {candidate.candidateName || "Unknown Candidate"}
              </h2>
              <div className="candidate-meta">
                <span className="candidate-id">{candidate.candidateId}</span>
                <span className="candidate-file" title={candidate.fileName}>
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span>{candidate.fileName}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Metrics section with mixed design */}
          <div className="candidate-metrics">
            {/* Match score - skill meter with subtle design */}
            <div className="metric-card">
              <div className="metric-title">Match</div>
              <div className="skill-level-track">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`skill-level ${
                      animateScore && matchScore >= level * 20 ? "active" : ""
                    }`}
                  />
                ))}
              </div>
              <div className="metric-value">{matchScore}%</div>
              <div className="metric-category">{getMatchCategory()}</div>
            </div>

            {/* Rank - current subtle design */}
            <div className="metric-card">
              <div className="metric-title">Rank</div>
              <div className="metric-value rank-value">
                <span className="rank-text">#{candidateRank}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="candidate-modal-content">
          <div className="candidate-content-section">
            <div className="section-header">
              <h3>Resume Summary</h3>
            </div>
            <div className="section-content">
              <p>{candidate.resumeSummary || "No summary available"}</p>
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="candidate-modal-footer">
          <button className="candidate-action secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="candidate-action primary"
            onClick={() => onViewParsedResume(candidate.parsedResume || "")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View Parsed Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;
