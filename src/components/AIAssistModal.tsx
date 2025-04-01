import React from "react";
import Loader from "./Loader";

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStepDescription: string;
  modalContent: string;
  loading: boolean;
}

const AIAssistModal: React.FC<AIAssistModalProps> = ({
  isOpen,
  onClose,
  selectedStepDescription,
  modalContent,
  loading,
}) => {
  if (!isOpen) return null;

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
          {loading ? (
            <Loader size="medium" />
          ) : (
            <div className="ai-response">
              <p className="selected-step-label">Selected Step:</p>
              <p className="selected-step-content">{selectedStepDescription}</p>
              <div className="ai-response-divider"></div>
              <p className="ai-response-content">{modalContent}</p>
            </div>
          )}
        </div>
        {!loading && (
          <div className="ai-modal-footer">
            <button className="ai-modal-close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistModal;
