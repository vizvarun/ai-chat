import { useState, useEffect } from "react";
import "../styles/TestCaseGenerator.css";
import TestPlanView from "../components/TestPlanView";
import TestCasesTable from "../components/TestCasesTable";
import Loader from "../components/Loader";
import SidebarItemLayout from "../components/SidebarItemLayout";
import { GenerateResponse } from "../types/testTypes";
import { testCasesService } from "../services/api/testCasesService";
import { UI_CONFIG } from "../config/env";

const TestCaseGenerator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<GenerateResponse | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("testPlans");
  const [inputCollapsed, setInputCollapsed] = useState(false);
  const [formDirty, setFormDirty] = useState(true);
  const [showChat, setShowChat] = useState(false); // New state for chat visibility

  // Track last submitted values to compare for changes
  const [lastSubmitted, setLastSubmitted] = useState({
    title: "",
    description: "",
  });

  // Toggle input section visibility
  const toggleInputSection = () => {
    setInputCollapsed(!inputCollapsed);
  };

  // Update title and mark form as dirty if value changed
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setFormDirty(
      newTitle !== lastSubmitted.title ||
        description !== lastSubmitted.description
    );
  };

  // Update description and mark form as dirty if value changed
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    setFormDirty(
      title !== lastSubmitted.title ||
        newDescription !== lastSubmitted.description
    );
  };

  // Generate test cases using API call
  const generateTestCases = async () => {
    setLoading(true);
    setError(null);

    try {
      // Add a timeout to cancel the request if it takes too long
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError("Request timed out. Please try again later.");
      }, UI_CONFIG.REQUEST_TIMEOUT); // Use timeout from environment config

      const response = await testCasesService.generateTestCases(
        title,
        description
      );

      // Clear timeout as request succeeded
      clearTimeout(timeoutId);

      // Check if we got any useful data
      if (
        (!response.testCases || response.testCases.length === 0) &&
        (!response.testPlans || response.testPlans.length === 0) &&
        !response.testExecutionPlan
      ) {
        setError(
          "No test cases or plans were generated. Please try with a more detailed description."
        );
      } else {
        setGeneratedData(response);
        setInputCollapsed(true); // Auto-collapse input section when results are ready

        // Store current values as last submitted and mark form as not dirty
        setLastSubmitted({ title, description });
        setFormDirty(false);
      }
    } catch (err: any) {
      // Enhanced error handling with more specific messages
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
        setError("Failed to generate test cases. Please try again later.");
      }
      console.error("Error generating test cases:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form to last submitted state or empty if never submitted
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFormDirty(false);
  };

  // Change to test cases tab if there are test cases but no test plans
  useEffect(() => {
    if (generatedData) {
      const hasTestPlans =
        generatedData.testPlans && generatedData.testPlans.length > 0;
      const hasExecutionPlan = !!generatedData.testExecutionPlan;
      const hasTestCases =
        generatedData.testCases && generatedData.testCases.length > 0;

      if (!hasTestPlans && !hasExecutionPlan && hasTestCases) {
        setActiveTab("testCases");
      }
    }
  }, [generatedData]);

  // Determine if test plans tab should be enabled
  const hasTestPlansContent =
    generatedData &&
    ((generatedData.testPlans && generatedData.testPlans.length > 0) ||
      !!generatedData.testExecutionPlan);

  // Determine if test cases tab should be enabled
  const hasTestCasesContent =
    generatedData &&
    generatedData.testCases &&
    generatedData.testCases.length > 0;

  // Render empty state when no test cases or plans are available
  const renderEmptyState = () => (
    <div className="empty-results">
      <p>
        No test cases or plans were generated. Please try with a more detailed
        description.
      </p>
    </div>
  );

  return (
    <SidebarItemLayout
      title="Test Case Generator"
      showChatOption={true}
      showChat={showChat}
      onToggleChat={() => setShowChat(!showChat)}
      isScrollable={!inputCollapsed && generatedData ? true : false}
    >
      {generatedData && (
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
          <label htmlFor="story-title">Enter Story Title</label>
          <input
            type="text"
            id="story-title"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g., User Authentication Feature"
            className="color-primary"
          />
        </div>
        <div className="input-field">
          <label htmlFor="story-description">Enter Story Description</label>
          <textarea
            id="story-description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Provide a detailed description of the story..."
            className="color-primary"
          />
        </div>

        <div className="button-container">
          <button
            className="generate-button"
            onClick={generateTestCases}
            disabled={
              loading || !title.trim() || !description.trim() || !formDirty
            }
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
                Generating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M19.5 5.5h-15v2h15v-2zm0 6h-15v2h15v-2zm-15 8h7v-2h-7v2z"
                  />
                  <path
                    fill="currentColor"
                    d="M16.5 17.5l2-1.5 2 1.5v-4h-4v4z"
                  />
                </svg>
                Generate Test Cases
              </>
            )}
          </button>

          {(title.length > 0 || description.length > 0) && (
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
            <p className="loading-text">
              Generating test cases, please wait...
            </p>
          </div>
        </div>
      )}

      {!loading && generatedData && (
        <div className="results-section">
          <div className="tabs-header">
            <button
              className={`tab-button ${
                activeTab === "testPlans" ? "active" : ""
              }`}
              onClick={() => setActiveTab("testPlans")}
              style={{ outline: "none" }}
              disabled={!hasTestPlansContent}
            >
              Test Plans
            </button>
            <button
              className={`tab-button ${
                activeTab === "testCases" ? "active" : ""
              }`}
              onClick={() => setActiveTab("testCases")}
              style={{ outline: "none" }}
              disabled={!hasTestCasesContent}
            >
              Test Cases
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "testPlans" && hasTestPlansContent ? (
              <TestPlanView
                testPlan={
                  generatedData.testPlans && generatedData.testPlans.length > 0
                    ? generatedData.testPlans[0]
                    : undefined
                }
                executionPlan={generatedData.testExecutionPlan}
              />
            ) : activeTab === "testCases" && hasTestCasesContent ? (
              <TestCasesTable testCases={generatedData.testCases} />
            ) : (
              renderEmptyState()
            )}
          </div>
        </div>
      )}
    </SidebarItemLayout>
  );
};

export default TestCaseGenerator;
