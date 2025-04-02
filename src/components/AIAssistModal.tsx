import React, { useState } from "react";
import Loader from "./Loader";
import "../styles/AIAssistModal.css";
import "../styles/theme.css"; // Import the theme file

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStepDescription: string;
  modalContent: string;
  loading: boolean;
  error: string | null;
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
          <div className="chat-container">
            <div className="message-group user-group">
              <div className="message-metadata">
                <div className="message-sender">You</div>
              </div>
              <div className="message-bubble user-message">
                <p>{selectedStepDescription}</p>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <Loader size="medium" />
                <p className="loading-text">Processing, please wait...</p>
              </div>
            ) : error ? (
              <div className="error-wrapper-ai-assistant">
                <div className="message-metadata">
                  <div className="message-sender">AI Assistant</div>
                </div>
                <div className="error-container">
                  <p className="ai-error-message">
                    {error ? error : "Something went wrong"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="message-group ai-group">
                <div className="message-metadata">
                  <div className="message-sender">AI Assistant</div>
                </div>
                <div className="message-bubble ai-message">
                  <div className="ai-content">
                    {modalContent}
                    {modalContent && (
                      <button
                        className={`ai-copy-button ${copied ? "copied" : ""}`}
                        onClick={handleCopy}
                        aria-label={copied ? "Copied" : "Copy to clipboard"}
                      >
                        {copied ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="copy-icon"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="copy-icon"
                          >
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <rect
                              x="8"
                              y="2"
                              width="8"
                              height="4"
                              rx="1"
                              ry="1"
                            ></rect>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
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
