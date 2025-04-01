import React, { useState } from "react";
import Loader from "./Loader";
import "../styles/AIAssistModal.css"; // Adjust the path as necessary
interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStepDescription: string;
  modalContent: string;
  loading: boolean;
  error?: string | null;
}

const AIAssistModal: React.FC<AIAssistModalProps> = ({
  isOpen,
  onClose,
  selectedStepDescription,
  modalContent,
  loading,
  error,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(modalContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <h3>AI Step Analysis</h3>
          <button className="ai-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="ai-modal-body">
          <div className="selected-step">
            <div className="selected-step-label">Selected test step:</div>
            <div className="selected-step-content">
              {selectedStepDescription}
            </div>
          </div>
          <div className="ai-response-divider"></div>
          {loading ? (
            <div className="ai-loading">
              <Loader />
              <p>Getting AI analysis...</p>
            </div>
          ) : error ? (
            <div className="ai-error">
              <svg
                className="error-icon"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="16"
                  x2="12"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p>{error}</p>
            </div>
          ) : (
            <div className="response-container">
              <div className="ai-message-container">
                <div className="selected-step-label">AI Response:</div>
                <div className="ai-message-wrapper ai-bot-message-wrapper">
                  <div className="ai-message ai-bot-message">
                    <div
                      className="ai-response-content"
                      dangerouslySetInnerHTML={{ __html: modalContent }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="ai-modal-footer">
          <button className="ai-modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistModal;
