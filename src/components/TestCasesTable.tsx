import React, { useEffect, useMemo, useState } from "react";
import { API_ENDPOINTS } from "../config/env";
import axiosInstance from "../services/api/axios"; // Import axios instance
import "../styles/TestCasesTable.css";
import { TestCasesTableProps } from "../types/testTypes";
import AIAssistModal from "./AIAssistModal";
import TablePagination from "./TablePagination";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const testCasesData = useMemo(() => {
    return Array.isArray(testCases) ? testCases : [];
  }, [testCases]);

  const columnHeaders = useMemo(() => {
    if (!Array.isArray(testCasesData) || testCasesData.length === 0) {
      return [];
    }

    return Object.keys(testCasesData[0]);
  }, [testCasesData]);
  useEffect(() => {
    try {
      if (!Array.isArray(testCasesData)) {
        setHasError(true);
        return;
      }
      if (testCasesData.length === 0) {
        setHasError(false);
        return;
      }

      const isValid = testCasesData.every(
        (testCase) => testCase && typeof testCase === "object"
      );

      setHasError(!isValid);
    } catch (error) {
      console.error("Error in TestCasesTable data validation:", error);
      setHasError(true);
    }
  }, [testCasesData]);

  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};

    if (Array.isArray(testCasesData)) {
      testCasesData.forEach((testCase, rowIndex) => {
        const testCaseId = `row-${rowIndex}`;

        Object.entries(testCase).forEach(([key, value]) => {
          if (
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === "object"
          ) {
            initialExpandedState[`${testCaseId}-${key}`] = false;
          }
        });
      });
    }

    setExpandedSections(initialExpandedState);
  }, [testCasesData]);

  const toggleExpandSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

    // Use query parameter approach
    const params = new URLSearchParams();
    params.append("content", stepDescription);
    const url = `${API_ENDPOINTS.CHAT_AI}?${params.toString()}`;

    axiosInstance
      .post(url, {})
      .then((response) => {
        if (response) {
          // Extract content from nested structure
          const aiResponse = response?.data?.choices?.[0]?.message?.content;
          if (aiResponse) {
            setModalContent(aiResponse);
          } else {
            setApiError("No response content received from the AI Assistant.");
          }
        } else {
          setApiError("No response received from the AI Assistant.");
        }
      })
      .catch((error) => {
        console.error("Error communicating with AI Assistant:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        setApiError(errorMessage);
      })
      .finally(() => {
        setLoadingAI(false);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  // Calculate pagination values
  const totalItems = testCasesData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentItems = testCasesData.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Close any expanded sections when changing pages
    setExpandedSections({});
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
    // Close any expanded sections when changing rows per page
    setExpandedSections({});
  };

  // Reset to first page when test cases data changes
  useEffect(() => {
    setCurrentPage(1);
    setExpandedSections({});
  }, [testCasesData.length]);

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
                        `row-${startIndex + rowIndex}`
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add pagination component */}
          {totalItems > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </div>
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
