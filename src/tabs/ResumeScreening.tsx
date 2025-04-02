import { useState } from "react";
import SidebarItemLayout from "../components/SidebarItemLayout";
import "../styles/ResumeScreening.css";

const ResumeScreening = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <SidebarItemLayout
      title="Resume Screening"
      showChatOption={true}
      showChat={showChat}
      onToggleChat={() => setShowChat(!showChat)}
    >
      <div className="resume-screening-content">
        <div className="resume-upload-section">
          <h3>Upload Resumes</h3>
          <p>Drag and drop files or click to browse</p>

          <div className="upload-area">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>Click or drag files here</p>
          </div>

          <button className="primary-button">Upload Resumes</button>
        </div>
        <div className="results-section">
          <h3>Analysis Results</h3>
          {/* Results will appear here */}
        </div>
      </div>
    </SidebarItemLayout>
  );
};

export default ResumeScreening;
