import { TestPlanViewProps } from "../types/testTypes";
import "../styles/TestPlanView.css";
import { useState } from "react";

const TestPlanView: React.FC<TestPlanViewProps> = ({
  testPlan,
  executionPlan,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copiedState, setCopiedState] = useState({
    executionPlan: false,
    testSteps: false,
  });

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const copyToClipboard = (text: string, type: "executionPlan" | "testSteps") => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedState((prev) => ({ ...prev, [type]: true }));
        setTimeout(() => {
          setCopiedState((prev) => ({ ...prev, [type]: false }));
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // If we have an execution plan string, display it with proper formatting
  if (executionPlan) {
    return (
      <div className={`test-plans enhanced ${isCollapsed ? "collapsed" : ""}`}>
        <div className="test-plan-header">
          <div className="header-content">
            <div className="title-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 16H12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="test-plan-title">Test Execution Plan</h3>
          </div>
          <button className="toggle-button" onClick={toggleCollapse}>
            {isCollapsed ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
        {!isCollapsed && (
          <div className="test-plan-execution">
            <div
              className="execution-plan-content"
              dangerouslySetInnerHTML={{ __html: executionPlan }}
            />
            <button
              className={`plan-copy-button ${
                copiedState.executionPlan ? "copied" : ""
              }`}
              onClick={() =>
                copyToClipboard(
                  executionPlan.replace(/<[^>]*>/g, ""),
                  "executionPlan"
                )
              }
              aria-label={
                copiedState.executionPlan ? "Copied" : "Copy to clipboard"
              }
            >
              {copiedState.executionPlan ? (
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
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // If no plan is provided
  if (!testPlan) {
    return (
      <div className="test-plans empty-test-plan enhanced">
        <div className="empty-state-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p>No test plan is available</p>
      </div>
    );
  }

  // Original rendering for test plan object
  return (
    <div className={`test-plans enhanced ${isCollapsed ? "collapsed" : ""}`}>
      <div className="test-plan-header">
        <div className="header-content">
          <div className="title-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="title-wrapper">
            <h3 className="test-plan-title">{testPlan.title}</h3>
            <p className="test-plan-description">{testPlan.description}</p>
          </div>
        </div>
        <button className="toggle-button" onClick={toggleCollapse}>
          {isCollapsed ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      {!isCollapsed && (
        <div className="test-plan-steps">
          <div className="steps-header">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="steps-icon"
            >
              <path
                d="M16 8L8 16M8 8L16 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Test Steps
            <button
              className={`plan-copy-button steps-copy-button ${
                copiedState.testSteps ? "copied" : ""
              }`}
              onClick={() =>
                copyToClipboard(testPlan.steps.join("\n"), "testSteps")
              }
              aria-label={
                copiedState.testSteps ? "Copied" : "Copy to clipboard"
              }
            >
              {copiedState.testSteps ? (
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
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              )}
            </button>
          </div>
          <ul className="steps-list">
            {testPlan.steps.map((step, index) => (
              <li key={index} className="step-item">
                <span className="step-number">{index + 1}.</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestPlanView;
