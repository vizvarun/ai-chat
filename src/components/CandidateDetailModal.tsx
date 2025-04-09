import React, { useEffect, useState } from "react";
import { ResumeResultRow } from "../types/resumeTypes";
import "../styles/CandidateDetailModal.css";
import Loader from "./Loader";
import { markdownToHtml } from "../utils/textProcessing";

interface CandidateDetailModalProps {
  candidate: ResumeResultRow;
  onClose: () => void;
  onViewParsedResume: (resume: string) => void;
  explanationData?: any;
  isLoading?: boolean;
  error?: string | null;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
  onViewParsedResume,
  explanationData,
  isLoading = false,
  error = null,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  const initials = (name: string = ""): string => {
    return name
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("");
  };

  const matchScore = candidate.matchScore || 0;

  const candidateRank =
    candidate.rank && candidate.rank > 0 ? candidate.rank : 1;

  const getMatchQuality = () => {
    if (matchScore >= 85) return "Excellent";
    if (matchScore >= 75) return "Strong";
    if (matchScore >= 60) return "Good";
    if (matchScore >= 40) return "Fair";
    if (matchScore >= 1) return "Bad";
    return "Basic";
  };

  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 50);
    const scoreTimer = setTimeout(() => setAnimateScore(true), 300);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(scoreTimer);
    };
  }, []);

  // Handle content click to prevent closing
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Parse explanation text into sections and convert markdown to HTML
  const renderExplanation = (explanationText: string) => {
    if (!explanationText) return <p>No explanation available</p>;

    // Split by sections denoted by ###
    const sections = explanationText.split(/(?=###\s+)/);

    return (
      <>
        {sections.map((section, index) => {
          // For the first section (intro paragraph), just render it as is
          if (index === 0 && !section.startsWith("###")) {
            const htmlContent = markdownToHtml(section.trim());
            return (
              <div
                key={index}
                className="explanation-intro"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            );
          }

          // For other sections, extract the heading and content
          const headingMatch = section.match(/###\s+([^:]+):/);
          if (!headingMatch) {
            const htmlContent = markdownToHtml(section.trim());
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            );
          }

          const heading = headingMatch[1];
          const content = section.replace(/###\s+[^:]+:/, "").trim();
          const htmlContent = markdownToHtml(content);

          return (
            <div key={index} className="explanation-section">
              <h4 className="explanation-heading">{heading}</h4>
              <div
                className="explanation-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="candidate-modal-overlay" onClick={onClose}>
      <div
        className={`candidate-modal-container ${showContent ? "visible" : ""}`}
        onClick={handleModalContentClick}
      >
        <div className="candidate-modal-header">
          {/* Candidate info on the left */}
          <div className="candidate-info">
            <div className="candidate-avatar">
              {initials(candidate.candidateName)}
            </div>
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

          <div className="candidate-metrics">
            <div className="metric-card">
              <div className="metric-title">Match</div>
              <div className="skill-level-track">
                {[0.1, 4, 6, 7.5, 8.5].map((level) => (
                  <div
                    key={level}
                    className={`skill-level ${
                      animateScore && matchScore >= level * 10 ? "active" : ""
                    }`}
                  />
                ))}
              </div>
              <div className="metric-value">{matchScore}%</div>
              <div className="metric-category">{getMatchQuality()}</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">Rank</div>
              <span
                className={`modal-badge ${
                  candidateRank === 1
                    ? "modal-top-rank-badge"
                    : "modal-score-badge"
                }`}
              >
                {candidateRank === 1 && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="modal-trophy-icon"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                )}
                {candidateRank === 1 ? `${candidateRank}` : `#${candidateRank}`}
              </span>
            </div>
          </div>
        </div>

        <div className="candidate-modal-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loader-with-text">
                <Loader size="medium" />
                <p className="loading-text">Loading detailed analysis...</p>
              </div>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : explanationData && explanationData.explanation ? (
            /* Display the explanation from API */
            <div className="candidate-content-section">
              <div className="section-header">
                <h3>Match Analysis</h3>
              </div>
              <div className="section-content explanation-container">
                {renderExplanation(explanationData.explanation)}
              </div>
            </div>
          ) : (
            /* Fallback to basic summary if no explanation data */
            <div className="candidate-content-section">
              <div className="section-header">
                <h3>Resume Summary</h3>
              </div>
              <div className="section-content">
                <p>{candidate.resumeSummary || "No summary available"}</p>
              </div>
            </div>
          )}
        </div>

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
