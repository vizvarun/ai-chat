import React, { useState, useMemo } from "react";
import { TestCase, TestCasesTableProps } from "../types/testTypes";
import "../styles/TestCasesTable.css";
import AIAssistModal from "./AIAssistModal";

const TestCasesTable: React.FC<TestCasesTableProps> = ({ testCases }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedStepDescription, setSelectedStepDescription] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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

  // Calculate pagination
  const totalItems = testCases.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return testCases.slice(startIndex, startIndex + pageSize);
  }, [testCases, currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Generate page buttons
  const renderPaginationButtons = () => {
    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key="prev"
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Previous page"
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
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    );

    // First page
    buttons.push(
      <button
        key={1}
        className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    // Ellipsis or pages
    if (totalPages > 7) {
      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis-1" className="pagination-ellipsis">
            ...
          </span>
        );
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          buttons.push(
            <button
              key={i}
              className={`pagination-button ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis-2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    } else {
      // Show all pages if total pages <= 7
      for (let i = 2; i < totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`pagination-button ${currentPage === i ? "active" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    }

    // Last page (if more than 1 page)
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`pagination-button ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="Next page"
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
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    );

    return buttons;
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
            {currentItems.map((testCase) => (
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

      {/* Pagination UI */}
      <div className="pagination-container">
        <div className="pagination-info">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
          <div className="page-size-selector">
            <label htmlFor="page-size">Show:</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="pagination-controls">{renderPaginationButtons()}</div>
      </div>

      {/* AIAssistModal */}
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
