import React from "react";
import NestedDataTable from "./NestedDataTable";

interface ExpandableSectionProps {
  sectionId: string;
  isExpanded: boolean;
  toggleSection: (id: string, e: React.MouseEvent) => void;
  displayName: string;
  value: any[];
  testCaseId: string;
  keyName: string;
  onAIAssist?: (description: string) => void;
  renderCellContent: (
    key: string,
    value: any,
    testCaseId: string
  ) => React.ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  sectionId,
  isExpanded,
  toggleSection,
  displayName,
  value,
  testCaseId,
  keyName,
  onAIAssist,
  renderCellContent,
}) => {
  // Extract all possible keys from all objects in the array
  const nestedHeaders = Array.from(
    new Set(value.flatMap((item) => Object.keys(item)))
  );

  return (
    <div>
      <div
        className="expandable-section"
        onClick={(e) => toggleSection(sectionId, e)}
      >
        <span className="expanded-indicator">{isExpanded ? "−" : "+"}</span>
        <span>
          {displayName} ({value.length})
        </span>
      </div>

      {isExpanded && (
        <NestedDataTable
          data={value}
          headers={nestedHeaders}
          testCaseId={testCaseId}
          parentKey={keyName}
          onAIAssist={onAIAssist}
          renderCellContent={renderCellContent}
        />
      )}
    </div>
  );
};

export default ExpandableSection;
