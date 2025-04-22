import { useState, useEffect } from "react";
import JDUploader from "../components/JDUploader";
import Loader from "../components/Loader";
import ResumeResultsTable from "../components/ResumeResultsTable";
import ResumeUploader from "../components/ResumeUploader";
import SidebarItemLayout from "../components/SidebarItemLayout";
import { resumeScreenerService } from "../services/api/resumeScreenerService";
import "../styles/ResumeScreener.css";
import { ResumeResultRow } from "../types/resumeTypes";

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
  const [errorTimeoutId, setErrorTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );
  const [inputCollapsed, setInputCollapsed] = useState(false);
  const [formDirty, setFormDirty] = useState(true);

  // New states for the enhanced workflow
  const [processingResumes, setProcessingResumes] = useState(false);
  const [rankingInProgress, setRankingInProgress] = useState(false);
  const [tableResults, setTableResults] = useState<ResumeResultRow[]>([]);
  const [resumeIds, setResumeIds] = useState<string[]>([]);

  // New state for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);

  // New states for final ranking
  const [jdResponse, setJdResponse] = useState<any>(null);
  const [resumeResponses, setResumeResponses] = useState<any[]>([]);

  // Add new state to track if scores have been received
  const [scoresReceived, setScoresReceived] = useState(false);

  // Add new state for selected resume pill (updated for multi-select)
  const [selectedResumeIds, setSelectedResumeIds] = useState<string[]>([]);

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
    setFormDirty(true);
  };

  // Reset the form
  const resetForm = () => {
    setJobDescription("");
    setJobDescriptionFile(null);
    setCriteria("");
    setResumes([]);
    setFormDirty(false);
    setTableResults([]);
    setProcessingResumes(false);
    setResumeIds([]);
    setResumeResponses([]);
    setJdResponse(null);
    setInputCollapsed(false);
    setScoresReceived(false);
    setSelectedResumeIds([]);
  };

  // Toggle input section visibility
  const toggleInputSection = () => {
    setInputCollapsed(!inputCollapsed);
  };

  // Process a single resume
  const processResumeFile = async (file: File, index: number) => {
    try {
      // Update status to processing
      setTableResults((prev) =>
        prev.map((row, i) =>
          i === index ? { ...row, status: "processing" } : row
        )
      );

      console.log(`Processing resume ${index}: ${file.name}`);

      const response = await resumeScreenerService.processResume(file, index);

      // Store the complete response for later use in final ranking
      setResumeResponses((prev) => [...prev, response]);

      // Extract data from nested response structure
      const parsedData = response?.parsed_data;
      const candidateName =
        response.custom_data?.candidateName ||
        parsedData?.custom_data?.candidateName ||
        "Unknown";

      const resumeId = parsedData?.resumeId || `temp-${index}`;
      const overview = parsedData?.overview || "";

      // Add resume ID to the list of processed resumes
      setResumeIds((prev) => [...prev, resumeId]);

      console.log("parsed", parsedData);

      console.log(
        `Resume ${index} processed successfully: ${candidateName}, Resume ID: ${resumeId}`
      );

      // Update table with results - match score and rank will come later
      setTableResults((prev) =>
        prev.map((row, i) =>
          i === index
            ? {
                ...row,
                resumeId: resumeId,
                candidateId: resumeId,
                candidateName: candidateName,
                resumeSummary: overview,
                parsedResume: JSON.stringify(parsedData, null, 2),
                status: "completed",
                hasFinalRanking: false, // Mark that we don't have final ranking yet
              }
            : row
        )
      );
      return response; // Return the response directly
    } catch (error) {
      console.error(`Error processing resume ${index}:`, error);
      setTableResults((prev) =>
        prev.map((row, i) =>
          i === index
            ? {
                ...row,
                status: "error",
                error: "Failed to process resume",
                hasFinalRanking: false,
              }
            : row
        )
      );
      throw error; // Re-throw to be caught by Promise.all
    }
  };

  // Handle showing parsed resume in modal
  const showParsedResume = (resume: string) => {
    setSelectedResume(resume);
    setModalOpen(true);
  };

  // Function to set error with auto-dismiss
  const setErrorWithTimeout = (errorMessage: string) => {
    // Clear any existing timeout
    if (errorTimeoutId) {
      clearTimeout(errorTimeoutId);
    }

    // Set the error
    setError(errorMessage);

    // Set a timeout to clear the error after 12 seconds
    const timeoutId = setTimeout(() => {
      setError(null);
    }, 12000);

    setErrorTimeoutId(timeoutId);
  };

  // Function to dismiss an error manually
  const dismissError = () => {
    if (errorTimeoutId) {
      clearTimeout(errorTimeoutId);
      setErrorTimeoutId(null);
    }
    setError(null);
  };

  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (errorTimeoutId) {
        clearTimeout(errorTimeoutId);
      }
    };
  }, [errorTimeoutId]);

  // Automatically open chat when scores are received
  useEffect(() => {
    if (scoresReceived) {
      setShowChat(true); // Auto-open chat when ranking completes
    }
  }, [scoresReceived]);

  // Find and select the top ranked resume when scores are received
  useEffect(() => {
    if (scoresReceived && tableResults.length > 0) {
      // Find the resume with rank 1
      const topRankedResume = tableResults.find((resume) => resume.rank === 1);
      if (topRankedResume) {
        setSelectedResumeIds([topRankedResume.resumeId]);
      }
    }
  }, [scoresReceived, tableResults]);

  // Handle form submission - updated workflow
  const rankResumes = async () => {
    // First clear everything and reset states
    setTableResults([]);
    setResumeIds([]);
    setResumeResponses([]); // Clear previous resume responses
    setJdResponse(null); // Clear previous job description response
    setScoresReceived(false); // Reset scores received state

    // Force a render cycle completion by using setTimeout
    setTimeout(() => {
      setLoading(true);
      // Use our new function instead of directly setting error to null
      if (errorTimeoutId) {
        clearTimeout(errorTimeoutId);
        setErrorTimeoutId(null);
      }
      setError(null);
      setProcessingResumes(true);
      setRankingInProgress(false);

      console.log("Starting resume ranking process");
      console.log(
        `Input: Job Description (${jobDescription.length} chars), Criteria: ${criteria}, ${resumes.length} resumes`
      );

      // Step 1: Initialize the table with resume files and show immediately
      const initialTableData: ResumeResultRow[] = resumes.map(
        (file, index) => ({
          serialNumber: index + 1,
          fileName: file.name,
          status: "pending",
          hasFinalRanking: false, // Add flag to track if final ranking is available
        })
      );

      setTableResults(initialTableData);
      setInputCollapsed(true);

      // Use an async IIFE to handle the rest of the process
      (async () => {
        try {
          // Step 2: Submit job description and get job description ID in the background
          console.log("Submitting job description in background");
          const jdPromise = resumeScreenerService.submitJobDescription(
            jobDescription,
            criteria,
            jobDescriptionFile
          );

          // Start processing resumes immediately - don't wait for JD
          console.log("Starting to process resumes");
          const processPromises = resumes.map((file, index) =>
            processResumeFile(file, index)
          );

          // Await JD submission in background
          const jdResponseData = await jdPromise;
          setJdResponse(jdResponseData);
          console.log(
            "Job Description processed with ID:",
            jdResponseData.jobDescriptionId
          );

          // Wait for all resume processing to complete and collect the responses directly
          console.log("Waiting for all resumes to be processed");

          let processedResponses;
          try {
            processedResponses = await Promise.all(processPromises);
            console.log(`All ${resumes.length} resumes processed successfully`);
          } catch (error) {
            console.error("Some resumes failed to process:", error);
            processedResponses = []; // Initialize with empty array on error
          }

          // Now make the final API call with all resume responses
          console.log(
            "Resume responses count:",
            processedResponses.length,
            "Expected:",
            resumes.length
          );

          // Use the directly collected responses instead of the state variable
          if (jdResponseData && processedResponses.length > 0) {
            console.log("Calling final ranking with all responses");

            // Set ranking in progress to update progress bar
            setRankingInProgress(true);

            // Extract just the parsed_data from each response
            const parsedDataArray = processedResponses.map(
              (response) => response.parsed_data
            );
            console.log(
              `Extracted ${parsedDataArray.length} parsed data objects for ranking`
            );

            try {
              const finalRankingResponse =
                await resumeScreenerService.rankResumesWithResponses({
                  request: jdResponseData,
                  resumes: parsedDataArray, // Send only the parsed data objects instead of complete responses
                });

              // Ranking is complete
              setRankingInProgress(false);

              console.log(
                "Final ranking completed successfully",
                finalRankingResponse
              );

              // Update the scores based on the response - adjusted for the actual API response format
              if (
                finalRankingResponse.resumeScores &&
                Array.isArray(finalRankingResponse.resumeScores)
              ) {
                // Create a mapping of resumeId to score data
                const scoreMap = new Map();
                finalRankingResponse.resumeScores.forEach((scoreData) => {
                  scoreMap.set(scoreData.resumeId, {
                    score: scoreData.score,
                    rank: scoreData.rank,
                    scoreCategory: scoreData.score_category,
                    relevantSkills: scoreData.relevantSkills || [],
                    relevantExperience: scoreData.relevantExperience || [],
                    strengths: scoreData.strengths || [],
                    weaknesses: scoreData.weaknesses || [],
                  });
                });

                // Update table results with scores
                setTableResults((prevResults) =>
                  prevResults.map((row) => {
                    const scoreData = scoreMap.get(row.resumeId);
                    if (scoreData) {
                      return {
                        ...row,
                        matchScore: scoreData.score,
                        rank: scoreData.rank,
                        scoreCategory: scoreData.scoreCategory,
                        relevantSkills: scoreData.relevantSkills,
                        relevantExperience: scoreData.relevantExperience,
                        strengths: scoreData.strengths,
                        weaknesses: scoreData.weaknesses,
                        hasFinalRanking: true,
                      };
                    }
                    return {
                      ...row,
                      hasFinalRanking: false,
                    };
                  })
                );

                // Sort results by rank after receiving scores
                setTableResults((prev) =>
                  [...prev].sort((a, b) => {
                    // First by completion status
                    if (a.status === "completed" && b.status !== "completed")
                      return -1;
                    if (a.status !== "completed" && b.status === "completed")
                      return 1;

                    // Then by rank for completed items
                    if (a.status === "completed" && b.status === "completed") {
                      if (a.hasFinalRanking && b.hasFinalRanking) {
                        return (a.rank || 999) - (b.rank || 999);
                      }
                      if (a.hasFinalRanking) return -1;
                      if (b.hasFinalRanking) return 1;
                    }

                    return 0;
                  })
                );

                // Mark that scores have been received
                setScoresReceived(true);
                setFormDirty(false);
              }
            } catch (rankingError) {
              console.error("Error during final ranking:", rankingError);
              setErrorWithTimeout(
                "Error during final ranking. Resume data is available but scores may not be accurate."
              );
            }
          } else {
            console.error(
              "Cannot proceed with final ranking: not all resumes were processed successfully",
              {
                resumesUploaded: resumes.length,
                resumesProcessed: processedResponses.length,
              }
            );
          }
        } catch (err: any) {
          console.error("Error during resume processing:", err);
          setErrorWithTimeout(
            err.message || "An error occurred during resume processing"
          );
          setRankingInProgress(false);
        } finally {
          setLoading(false);
          setProcessingResumes(false);
          setRankingInProgress(false);
          console.log("Resume ranking process complete");
        }
      })();
    }, 10); // Short timeout to ensure state updates have completed
  };

  // Check if form is valid for submission
  const isFormValid = jobDescription.trim() !== "" && resumes.length > 0;

  // Handle selecting a resume pill (updated for multi-select)
  const handleResumeSelect = (resumeId: string | null) => {
    if (resumeId === null) {
      // Clear selection when null is passed
      setSelectedResumeIds([]);
    } else {
      // Toggle the selection - add if not present, remove if present
      setSelectedResumeIds((prevSelected) => {
        if (prevSelected.includes(resumeId)) {
          return prevSelected.filter((id) => id !== resumeId);
        } else {
          return [...prevSelected, resumeId];
        }
      });
    }
  };

  return (
    <SidebarItemLayout
      title="Resume Screening"
      showChatOption={scoresReceived} // Only show chat option after scores are received
      showChat={showChat && scoresReceived} // Only enable chat after ranking is complete
      onToggleChat={() => setShowChat(!showChat)}
      isScrollable={!inputCollapsed || tableResults.length > 0}
      // Add props to pass resume data to chat component with proper job ID
      chatProps={{
        resumeResults: tableResults.filter((resume) => resume.hasFinalRanking),
        selectedResumeIds: selectedResumeIds, // Change to selectedResumeIds
        onResumeSelect: handleResumeSelect,
        jobId: jdResponse?.requestId || "", // Use jobDescriptionId instead of requestId
      }}
    >
      {(tableResults.length > 0 || inputCollapsed) && (
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
        <div className="error-toast">
          <div className="error-toast-content">
            <p>{error}</p>
            <button
              className="dismiss-error-btn"
              onClick={dismissError}
              aria-label="Dismiss error"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
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
        </div>
      )}

      {tableResults.length > 0 && (
        <div className="results-section">
          <ResumeResultsTable
            results={tableResults} // Show all results, not filtered
            isProcessing={processingResumes}
            isRanking={rankingInProgress}
            onViewParsedResume={showParsedResume}
            scoresReceived={scoresReceived}
            jdResponse={jdResponse} // Pass the full jdResponse object
          />
        </div>
      )}

      {loading && !tableResults.length && (
        <div className="loading">
          <div className="loader-with-text">
            <Loader size="medium" />
            <p className="loading-text">
              Processing job description, please wait...
            </p>
          </div>
        </div>
      )}

      {/* Modal for parsed resume - improved UI */}
      {modalOpen && selectedResume && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content parsed-resume-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Parsed Resume</h3>
            </div>
            <div className="modal-body resume-modal-body">
              <div className="resume-content-container">
                <pre className="parsed-resume-content">{selectedResume}</pre>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="candidate-action secondary"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarItemLayout>
  );
};

export default ResumeScreener;
