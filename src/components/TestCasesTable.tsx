import React, { useState } from "react";
import { TestCase, TestCasesTableProps } from "../types/testTypes";
import "../styles/TestCasesTable.css";
import AIAssistModal from "./AIAssistModal";
import Loader from "./Loader";

// Sample large data for testing overflow
const sampleLargeTestCase: TestCase = {
  "Test Case ID": "TC_OVERFLOW_TEST_001",
  "Test Case Description":
    "This is an extremely long test case description that is intended to test how the table handles text overflow in the description column. It should extend beyond the normal width of the cell to verify that the layout remains intact and scrolling works properly without breaking the UI design.",
  "Test Steps": [
    {
      "Step ID": "STEP_001",
      "Step Description":
        "Initialize the application with a very complex configuration that includes multiple parameters and settings that require significant horizontal space to display correctly in the table cell.",
      "Expected Result":
        "The application should initialize correctly with all configuration parameters properly applied and no errors displayed in the console or UI. All elements should render as expected despite the lengthy text.",
    },
    {
      "Step ID": "STEP_002",
      "Step Description":
        "Navigate to a deeply nested menu structure with an extremely long path that requires significant horizontal space to display. This tests horizontal overflow in the step description cell.",
      "Expected Result":
        "The navigation should complete successfully and the target screen should be displayed with all expected components visible and properly aligned within the viewport.",
    },
    {
      "Step ID": "STEP_003",
      "Step Description":
        "Enter a large amount of test data into multiple form fields with various validation rules. This step includes special characters, numbers, and text to test all input validation scenarios.",
      "Expected Result":
        "All form fields should accept the input without UI distortion. Validation messages should appear in appropriate locations without breaking the layout.",
    },
    {
      "Step ID": "STEP_004",
      "Step Description":
        "Perform a complex search operation using multiple filter criteria and sort options to test the system's ability to handle compound queries.",
      "Expected Result":
        "Search results should be displayed correctly, maintaining proper pagination, sorting order, and filter status indicators. The UI should remain responsive and visually consistent.",
    },
    {
      "Step ID": "STEP_005",
      "Step Description":
        "Export the results to various file formats while selecting all available options and custom configurations to test the export functionality's handling of complex settings.",
      "Expected Result":
        "Export process should complete without errors. Generated files should contain all expected data with proper formatting according to the selected export options.",
    },
  ],
  Priority: "High",
  "Test Data":
    "Username=admin@example.com; Password=Secur3P@ssw0rd!; Server=production-cluster-east-1.example.com; Port=8443; Protocol=HTTPS; API_Key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
};

const TestCasesTable: React.FC<TestCasesTableProps> = ({ testCases }) => {
  const testCasesWithSample = [...testCases, sampleLargeTestCase];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedStepDescription, setSelectedStepDescription] = useState("");

  const renderPriorityWithIcon = (priority: string) => {
    const priorityLower = priority.toLowerCase();

    if (priorityLower.includes("high")) {
      return (
        <div className="priority-wrapper high-priority">
          <span className="priority-icon">⚠️</span>
          {priority}
        </div>
      );
    } else if (priorityLower.includes("medium")) {
      return (
        <div className="priority-wrapper medium-priority">
          <span className="priority-icon">⚡</span>
          {priority}
        </div>
      );
    } else if (priorityLower.includes("low")) {
      return (
        <div className="priority-wrapper low-priority">
          <span className="priority-icon">📌</span>
          {priority}
        </div>
      );
    }

    return priority;
  };

  const handleAIAssist = (stepDescription: string) => {
    setSelectedStepDescription(stepDescription);
    setIsModalOpen(true);
    setLoadingAI(true);

    // Simulate API call
    setTimeout(() => {
      const aiResponse =
        `AI Analysis for step: "${stepDescription.substring(0, 50)}..."\n\n` +
        "This step appears to be testing the application's ability to handle complex configurations. " +
        "Consider adding validation for edge cases such as:\n" +
        "- Maximum character limits\n" +
        "- Special character handling\n" +
        "- Performance under load\n" +
        "- Error recovery scenarios";

      setModalContent(aiResponse);
      setLoadingAI(false);
    }, 1500);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  return (
    <div className="test-cases-container">
      <div className="table-scroll-wrapper">
        <table className="test-cases-table">
          <thead>
            <tr>
              <th>Test Case ID</th>
              <th>Test Case Description</th>
              <th>Test Steps</th>
              <th>Priority</th>
              <th>Test Data</th>
            </tr>
          </thead>
          <tbody>
            {testCasesWithSample.map((testCase) => (
              <tr key={testCase["Test Case ID"]}>
                <td className="test-case-id">{testCase["Test Case ID"]}</td>
                <td>{testCase["Test Case Description"]}</td>
                <td>
                  <table className="nested-steps-table">
                    <thead>
                      <tr>
                        <th>Step ID</th>
                        <th>Description</th>
                        <th>Expected Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testCase["Test Steps"].map((step) => (
                        <tr key={step["Step ID"]}>
                          <td className="step-case-id">{step["Step ID"]}</td>
                          <td className="step-description-cell">
                            <div className="step-description-content">
                              {step["Step Description"]}
                              <button
                                className="ai-assist-button"
                                onClick={() =>
                                  handleAIAssist(step["Step Description"])
                                }
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="ai-icon"
                                >
                                  {/* Simple AI text in circle icon */}
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="currentColor"
                                  />
                                  <text
                                    x="12"
                                    y="16"
                                    fontSize="10"
                                    fontWeight="bold"
                                    fill="white"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    AI
                                  </text>
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td>{step["Expected Result"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>{renderPriorityWithIcon(testCase["Priority"])}</td>
                <td>{testCase["Test Data"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Use the AIAssistModal component */}
      <AIAssistModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedStepDescription={selectedStepDescription}
        modalContent={modalContent}
        loading={loadingAI}
      />
    </div>
  );
};

export default TestCasesTable;
