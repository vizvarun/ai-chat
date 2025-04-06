import { useState, useEffect } from "react";
import SidebarItemLayout from "../components/SidebarItemLayout";
import Loader from "../components/Loader";
import JDUploader from "../components/JDUploader";
import ResumeUploader from "../components/ResumeUploader";
import ResumeResults from "../components/ResumeResults";
import "../styles/ResumeScreener.css";
import { resumeScreenerService } from "../services/api/resumeScreenerService";
import { RankedCandidatesResponse } from "../types/resumeTypes";
import { UI_CONFIG } from "../config/env";

const ResumeScreener = () => {
  // State for chat toggle
  const [showChat, setShowChat] = useState(false);

  // Form input states
  const [jobDescription, setJobDescription] = useState("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(
    null
  );
  const [criteria, setCriteria] = useState("");
  const [resumes, setResumes] = useState<File[]>([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RankedCandidatesResponse | null>(null);
  const [inputCollapsed, setInputCollapsed] = useState(false);
  const [formDirty, setFormDirty] = useState(true);

  // Handle job description text input
  const handleJobDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // Only update text if there's no file - otherwise ignore changes
    if (!jobDescriptionFile) {
      setJobDescription(e.target.value);
      setFormDirty(true);
    }
  };

  // Handle criteria text input
  const handleCriteriaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCriteria(e.target.value);
    setFormDirty(true);
  };

  // Handle JD file change
  const handleJobDescriptionFileChange = (file: File) => {
    setJobDescriptionFile(file);
    setFormDirty(true);

    // When a file is uploaded, it always takes priority
    if (
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // In a real app, you might use PDF.js or other libraries to extract text
      setJobDescription(`File selected: ${file.name}`);
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setJobDescription(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle clearing the JD file
  const handleClearJDFile = () => {
    setJobDescriptionFile(null);
    setJobDescription("");
    setFormDirty(true);
  };

  // Handle resume files change
  const handleResumeFilesChange = (files: File[]) => {
    setResumes((prev) => [...prev, ...files]);
    setFormDirty(true);
  };

  // Remove a resume from the list
  const removeResume = (index: number) => {
    setResumes((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset the form
  const resetForm = () => {
    setJobDescription("");
    setJobDescriptionFile(null);
    setCriteria("");
    setResumes([]);
    setFormDirty(false);
  };

  // Toggle input section visibility
  const toggleInputSection = () => {
    setInputCollapsed(!inputCollapsed);
  };

  // Handle form submission
  const rankResumes = async () => {
    setLoading(true);
    setError(null);

    try {
      // Set timeout for long requests
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError("Request timed out. Please try again later.");
      }, UI_CONFIG.REQUEST_TIMEOUT);

      // Make API call
      const response = await resumeScreenerService.rankResumes(
        jobDescription,
        criteria,
        jobDescriptionFile,
        resumes
      );

      clearTimeout(timeoutId);

      // Process response
      if (response) {
        setResults(response);
        setInputCollapsed(true);
        setFormDirty(false);
      } else {
        setError("No results returned. Please try again.");
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 429) {
          setError("Too many requests. Please wait a moment and try again.");
        } else if (err.response.status >= 500) {
          setError("Server error. Our team has been notified.");
        } else {
          setError(
            `Request failed: ${err.response.data?.message || "Unknown error"}`
          );
        }
      } else if (err.request) {
        setError(
          "No response from server. Please check your internet connection."
        );
      } else {
        setError("Failed to rank resumes. Please try again later.");
      }
      console.error("Error ranking resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for submission
  const isFormValid = jobDescription.trim() !== "" && resumes.length > 0;

  return (
    <SidebarItemLayout
      title="Resume Screening"
      showChatOption={true}
      showChat={showChat}
      onToggleChat={() => setShowChat(!showChat)}
      isScrollable={!inputCollapsed && results ? true : false}
    >
      {results && (
        <div className="input-collapse-control">
          <button
            className="collapse-toggle-btn"
            onClick={toggleInputSection}
            aria-label={
              inputCollapsed ? "Expand input section" : "Collapse input section"
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`collapse-arrow ${inputCollapsed ? "collapsed" : ""}`}
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {inputCollapsed ? "Show Input Fields" : "Hide Input Fields"}
          </button>
        </div>
      )}

      <div className={`input-section ${inputCollapsed ? "collapsed" : ""}`}>
        <div className="input-field">
          <label htmlFor="job-description">Job Description</label>
          <div className="upload-options-container">
            <div className="textarea-container">
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                placeholder={
                  jobDescriptionFile
                    ? "Using uploaded job description file..."
                    : "Enter job description or upload a file..."
                }
                className={`color-primary ${
                  jobDescriptionFile ? "has-file" : ""
                }`}
                readOnly={!!jobDescriptionFile}
              />
              {jobDescriptionFile && (
                <div className="textarea-file-indicator">
                  <div className="file-badge">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span>{jobDescriptionFile.name}</span>
                  </div>
                  <button
                    type="button"
                    className="clear-file-btn"
                    onClick={handleClearJDFile}
                    aria-label="Clear file and enable editing"
                    title="Clear file and enable manual editing"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <JDUploader
              file={jobDescriptionFile}
              onFileChange={handleJobDescriptionFileChange}
              onClearFile={handleClearJDFile}
            />
          </div>
        </div>

        <div className="input-field">
          <label>Upload Resumes</label>
          <ResumeUploader
            files={resumes}
            onFileChange={handleResumeFilesChange}
            onFileRemove={removeResume}
          />
        </div>

        <div className="input-field">
          <label htmlFor="criteria">Screening Criteria</label>
          <textarea
            id="criteria"
            value={criteria}
            onChange={handleCriteriaChange}
            placeholder="Enter screening criteria (e.g., years of experience, required skills)..."
            className="color-primary"
          />
        </div>

        <div className="disclaimer-container">
          <div className="disclaimer-message">
            <small>
              Disclaimer: AI-generated content. Use with discretion.
            </small>
          </div>
        </div>

        <div className="button-container">
          <button
            className="generate-button"
            onClick={rankResumes}
            disabled={loading || !isFormValid || !formDirty}
          >
            {loading ? (
              <>
                <svg
                  className="spinner"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="30 30"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <line x1="8" y1="10" x2="8" y2="18"></line>
                  <line x1="12" y1="8" x2="12" y2="18"></line>
                  <line x1="16" y1="12" x2="16" y2="18"></line>
                </svg>
                Rank Resumes
              </>
            )}
          </button>

          {(jobDescription.length > 0 ||
            criteria.length > 0 ||
            resumes.length > 0) && (
            <button
              className="reset-button"
              onClick={resetForm}
              aria-label="Reset form"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="currentColor"
                  d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="loader-with-text">
            <Loader size="medium" />
            <p className="loading-text">Processing resumes, please wait...</p>
          </div>
        </div>
      )}

      {!loading && results && (
        <div className="results-section">
          <h3>Ranked Results</h3>
          <div className="resume-results">
            <ResumeResults candidates={results.rankedCandidates} />
          </div>
        </div>
      )}
    </SidebarItemLayout>
  );
};

export default ResumeScreener;
