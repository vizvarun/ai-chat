import React from "react";

interface NestedDataTableProps {
  data: any[];
  headers: string[];
  testCaseId: string;
  parentKey: string;
  onAIAssist?: (description: string) => void;
  renderCellContent: (
    key: string,
    value: any,
    testCaseId: string
  ) => React.ReactNode;
}

const NestedDataTable: React.FC<NestedDataTableProps> = ({
  data,
  headers,
  testCaseId,
  parentKey,
  onAIAssist,
  renderCellContent,
}) => {
  return (
    <div className="nested-table-wrapper">
      <table className="nested-data-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr key={`${testCaseId}-${parentKey}-${index}`}>
              {headers.map((header) => (
                <td key={`${testCaseId}-${parentKey}-${header}-${index}`}>
                  {typeof item[header] === "string" &&
                  header.toLowerCase().includes("description") &&
                  onAIAssist ? (
                    <div className="step-description-content">
                      <div className="step-description-text">
                        {item[header]}
                      </div>
                      <button
                        className="ai-assist-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAIAssist(item[header]);
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ai-icon"
                        >
                          <circle cx="12" cy="12" r="10" fill="currentColor" />
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
                        `${testCaseId}-${parentKey}-${index}`
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
  );
};

export default NestedDataTable;
