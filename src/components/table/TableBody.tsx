import React from "react";

interface TableBodyProps {
  columnHeaders: string[];
  currentItems: Record<string, any>[];
  renderCellContent: (
    key: string,
    value: any,
    testCaseId: string
  ) => React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({
  columnHeaders,
  currentItems,
  renderCellContent,
}) => {
  return (
    <tbody>
      {currentItems.map((testCase, rowIndex) => (
        <tr key={`row-${rowIndex}`}>
          {columnHeaders.map((header, colIndex) => (
            <td
              key={`${rowIndex}-${header}`}
              className={colIndex < 2 ? "sticky-column" : ""}
              style={colIndex < 2 ? { left: colIndex === 0 ? 0 : "auto" } : {}}
              data-label={header}
            >
              {header in testCase ? (
                renderCellContent(header, testCase[header], `row-${rowIndex}`)
              ) : (
                <span className="empty-value">-</span>
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
