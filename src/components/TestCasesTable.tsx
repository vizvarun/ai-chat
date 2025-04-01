import React, { useState, useMemo, useEffect } from "react";
import { TestCasesTableProps } from "../types/testTypes";
import "../styles/TestCasesTable.css";
import AIAssistModal from "./AIAssistModal";
import { generateChatId } from "../utils/idGenerator";
import axiosInstance from "../services/api/axios"; // Import axios instance

const TestCasesTable: React.FC<TestCasesTableProps> = ({ testCases }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedStepDescription, setSelectedStepDescription] = useState("");
  const [hasError, setHasError] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Use only the test cases provided through props
  const testCasesData = useMemo(() => {
    return Array.isArray(testCases) ? testCases : [];
  }, [testCases]);

  // Extract dynamic column headers from data
  const columnHeaders = useMemo(() => {
    if (!Array.isArray(testCasesData) || testCasesData.length === 0) {
      return [];
    }

    return Object.keys(testCasesData[0]);
  }, [testCasesData]);

  // Check for data validity
  useEffect(() => {
    try {
      // Validate if testCasesData is an array
      if (!Array.isArray(testCasesData)) {
        setHasError(true);
        return;
      }

      // Check if we have any test cases
      if (testCasesData.length === 0) {
        setHasError(false); // Not an error, just empty
        return;
      }

      // Check if each test case has some minimal structure
      const isValid = testCasesData.every(
        (testCase) => testCase && typeof testCase === "object"
      );

      setHasError(!isValid);
    } catch (error) {
      console.error("Error in TestCasesTable data validation:", error);
      setHasError(true);
    }
  }, [testCasesData]);

  // Generate all possible section IDs on initial load and set them to collapsed
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};

    if (Array.isArray(testCasesData)) {
      testCasesData.forEach((testCase, rowIndex) => {
        const testCaseId = `row-${rowIndex}`;

        // Check all properties of the test case for arrays
        Object.entries(testCase).forEach(([key, value]) => {
          if (
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === "object"
          ) {
            initialExpandedState[`${testCaseId}-${key}`] = false; // Default to collapsed
          }
        });
      });
    }

    setExpandedSections(initialExpandedState);
  }, [testCasesData]);

  // Toggle expanded state for nested sections - simplified to ensure single click works
  const toggleExpandSection = (id: string, e: React.MouseEvent) => {
    // Prevent event bubbling
    e.stopPropagation();

    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // If there's an error, show error message
  if (hasError) {
    return (
      <div className="test-cases-error-container">
        <div className="test-cases-error">
          <svg
            className="error-icon"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="16"
              x2="12"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h3>Something went wrong</h3>
          <p>
            We encountered an issue displaying the test cases. Please try again
            later.
          </p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if test cases array is empty
  if (!Array.isArray(testCasesData) || testCasesData.length === 0) {
    return (
      <div className="test-cases-error-container">
        <div className="test-cases-error">
          <h3>No Test Cases Available</h3>
          <p>No test cases were found. Try generating new test cases.</p>
        </div>
      </div>
    );
  }

  const renderPriorityWithIcon = (priority: string) => {
    if (!priority) return null;

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
    setApiError(null);

    const chatId = generateChatId();

    const aiApiUrl = import.meta.env.VITE_AI_API_URL;

    // Define the request payload
    const requestData = {
      userId: "user123", // This could be made dynamic in the future
      userType: "msp",
      chatId: chatId,
      messages: [
        {
          role: "user",
          content: stepDescription, // Providing context to the AI
        },
      ],
      tools: [
        { function: { name: "scheduleInterview" } },
        { function: { name: "knowledge" } },
      ],
      stream: false,
    };

    axiosInstance
      .post(aiApiUrl, requestData)
      .then((response) => {
        if (response) {
          setModalContent(response?.data?.choices[0]?.message?.content);
        } else {
          throw new Error("Invalid response format from API");
        }
        setLoadingAI(false);
      })
      .catch((error) => {
        console.error("Error fetching AI analysis:", error);
        setApiError(
          error.response?.data?.message ||
            error.message ||
            "Failed to get AI analysis. Please try again."
        );
        setModalContent("");
        setLoadingAI(false);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  // Calculate pagination
  const totalItems = testCasesData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return testCasesData.slice(startIndex, startIndex + pageSize);
  }, [testCasesData, currentPage, pageSize]);

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

  // Check if a value is an array
  const isArrayValue = (value: any) => Array.isArray(value);

  // Render a cell based on its content type
  const renderCellContent = (key: string, value: any, testCaseId: string) => {
    // If value is null/undefined
    if (value === null || value === undefined) {
      return <span className="empty-value">-</span>;
    }

    // If value is an array, render as nested table, regardless of the key name
    if (isArrayValue(value)) {
      const sectionId = `${testCaseId}-${key}`;
      const isExpanded = expandedSections[sectionId] === true; // Default to collapsed

      // Check if array has objects with key-value pairs
      if (value.length > 0 && typeof value[0] === "object") {
        // Extract all possible keys from all objects in the array
        const nestedHeaders = Array.from(
          new Set(value.flatMap((item) => Object.keys(item)))
        );

        const displayName = key.replace(/([A-Z])/g, " $1").trim(); // Add spaces before capital letters

        return (
          <div>
            <div
              className="expandable-section"
              onClick={(e) => toggleExpandSection(sectionId, e)}
            >
              <span className="expanded-indicator">
                {isExpanded ? "−" : "+"}
              </span>
              <span>
                {displayName} ({value.length})
              </span>
            </div>

            {isExpanded && (
              <div className="nested-table-wrapper">
                <table className="nested-data-table">
                  <thead>
                    <tr>
                      {nestedHeaders.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {value.map((item: any, index: number) => (
                      <tr key={`${testCaseId}-${key}-${index}`}>
                        {nestedHeaders.map((header) => (
                          <td key={`${testCaseId}-${key}-${header}-${index}`}>
                            {typeof item[header] === "string" &&
                            header.toLowerCase().includes("description") ? (
                              <div className="step-description-content">
                                <div className="step-description-text">
                                  {item[header]}
                                </div>
                                <button
                                  className="ai-assist-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAIAssist(item[header]);
                                  }}
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="ai-icon"
                                  >
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
                            ) : item[header] !== undefined ? (
                              // Recursively handle nested objects and arrays
                              typeof item[header] === "object" ? (
                                renderCellContent(
                                  header,
                                  item[header],
                                  `${testCaseId}-${key}-${index}`
                                )
                              ) : (
                                <span className="full-content">
                                  {item[header].toString()}
                                </span>
                              )
                            ) : (
                              <span className="empty-value">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      }

      // Simple array of values
      return (
        <ul className="array-value-list">
          {value.map((item: any, index: number) => (
            <li key={`${testCaseId}-${key}-${index}`}>
              {typeof item === "object"
                ? JSON.stringify(item)
                : item.toString()}
            </li>
          ))}
        </ul>
      );
    }

    // If key contains "priority" (case insensitive)
    if (typeof value === "string" && key.toLowerCase().includes("priority")) {
      return renderPriorityWithIcon(value);
    }

    // Handle objects (non-array)
    if (typeof value === "object") {
      return (
        <div className="object-value">
          {Object.entries(value).map(([objKey, objValue]) => (
            <div
              key={`${testCaseId}-${key}-${objKey}`}
              className="object-property"
            >
              <span className="object-key">{objKey}:</span>
              <span className="object-value">
                {typeof objValue === "object"
                  ? JSON.stringify(objValue)
                  : objValue?.toString()}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Default case for simple values - wrap in a span for better styling control
    return <span className="full-content">{value.toString()}</span>;
  };

  return (
    <div className="test-cases-container">
      <div className="table-scroll-wrapper">
        <div className="table-container horizontal-scroll">
          <table className="test-cases-table">
            <thead>
              <tr>
                {columnHeaders.map((header, index) => (
                  <th
                    key={header}
                    className={index < 2 ? "sticky-column" : ""}
                    style={index < 2 ? { left: index === 0 ? 0 : "12%" } : {}}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((testCase, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {columnHeaders.map((header, colIndex) => (
                    <td
                      key={`${rowIndex}-${header}`}
                      className={colIndex < 2 ? "sticky-column" : ""}
                      style={
                        colIndex < 2 ? { left: colIndex === 0 ? 0 : "12%" } : {}
                      }
                    >
                      {renderCellContent(
                        header,
                        testCase[header],
                        `row-${rowIndex}`
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        error={apiError} // Pass the error to the modal
      />
    </div>
  );
};

export default TestCasesTable;
