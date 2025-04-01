import React, { useState } from "react";
import Loader from "./Loader";
import "../styles/AIAssistModal.css"; // Adjust the path as necessary
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
          <p className="selected-step-label">Selected Step:</p>
          <div className="selected-step-content">{selectedStepDescription}</div>

          <div className="ai-response-divider"></div>

          {loading ? (
            <div className="ai-loading-state">
              <Loader size="medium" />
              <p>Analyzing step...</p>
            </div>
          ) : error ? (
            <div className="ai-error-state">
              <p className="error-message">{error}</p>
            </div>
          ) : (
            <>
              <div className="ai-response-content">{modalContent}</div>
              {modalContent && (
                <div className="copy-button-wrapper">
                  <button
                    className="copy-button-icon"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                    {copied ? "Copied!" : ""}
                  </button>
                </div>
              )}
            </>
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
