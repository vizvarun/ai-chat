import React, { useState } from "react";
import { TestCase, TestCasesTableProps } from "../types/testTypes";
import "../styles/TestCasesTable.css";
import AIAssistModal from "./AIAssistModal";

const TestCasesTable: React.FC<TestCasesTableProps> = ({ testCases }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedStepDescription, setSelectedStepDescription] = useState("");

  const renderPriorityWithIcon = (priority: string) => {
    const priorityLower = priority.toLowerCase();

    if (priorityLower.includes("high")) {
      return (
        <div className="priority-badge priority-high">
          <span className="priority-dot"></span>
          {priority}
        </div>
      );
    } else if (priorityLower.includes("medium")) {
      return (
        <div className="priority-badge priority-medium">
          <span className="priority-dot"></span>
          {priority}
        </div>
      );
    } else if (priorityLower.includes("low")) {
      return (
        <div className="priority-badge priority-low">
          <span className="priority-dot"></span>
          {priority}
        </div>
      );
    }

    return (
      <div className="priority-badge priority-default">
        <span className="priority-dot"></span>
        {priority}
      </div>
    );
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
            {testCases.map((testCase) => (
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
