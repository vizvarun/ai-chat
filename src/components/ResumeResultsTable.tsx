import { useState } from "react";
import { ResumeResultRow } from "../types/resumeTypes";
import CandidateDetailModal from "./CandidateDetailModal";
import Loader from "./Loader";
import TablePagination from "./TablePagination";

interface ResumeResultsTableProps {
  results: ResumeResultRow[];
  isProcessing: boolean;
  onViewParsedResume: (resume: string) => void;
}

const ResumeResultsTable: React.FC<ResumeResultsTableProps> = ({
  results,
  isProcessing,
  onViewParsedResume,
}) => {
  const [sortBy, setSortBy] = useState<"rank" | "name">("rank");
  const [selectedCandidate, setSelectedCandidate] =
    useState<ResumeResultRow | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sortedResults = [...results].sort((a, b) => {
    // Always put completed items first
    if (a.status === "completed" && b.status !== "completed") return -1;
    if (a.status !== "completed" && b.status === "completed") return 1;

    // Sort by selected criteria for completed items
    if (a.status === "completed" && b.status === "completed") {
      if (sortBy === "rank") {
        return (a.rank || 999) - (b.rank || 999);
      } else {
        return (a.candidateName || "").localeCompare(b.candidateName || "");
      }
    }

    // For non-completed items, maintain original order
    return 0;
  });

  // Calculate pagination values
  const totalPages = Math.ceil(sortedResults.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = sortedResults.slice(startIndex, endIndex);

  console.log("currentPageData", currentPageData);

  const handleSort = (type: "rank" | "name") => {
    setSortBy(type);
  };

  // Count how many resumes are still processing
  const processingCount = results.filter(
    (row) => row.status === "processing" || row.status === "pending"
  ).length;

  const handleCandidateClick = (candidate: ResumeResultRow) => {
    if (candidate.status === "completed" && !isProcessing) {
      setSelectedCandidate(candidate);
    }
  };

  const handleCloseModal = () => {
    setSelectedCandidate(null);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <div className="table-actions">
          {isProcessing ? (
            <div className="processing-pill">
              <span className="pulse-dot"></span>
              <span>Processing {processingCount} resumes</span>
            </div>
          ) : (
            <div className="sort-controls">
              <span className="sort-label">Sort by:</span>
              <div className="sort-buttons">
                <button
                  className={`sort-button ${sortBy === "rank" ? "active" : ""}`}
                  onClick={() => handleSort("rank")}
                  title="Sort by rank"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  Rank
                </button>
                <button
                  className={`sort-button ${sortBy === "name" ? "active" : ""}`}
                  onClick={() => handleSort("name")}
                  title="Sort by name"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M3 12h18M3 18h18"></path>
                  </svg>
                  Name
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="centered">#</th>
              <th>File Name</th>
              <th>Candidate ID</th>
              <th>Candidate Name</th>
              <th className="centered">Match Score</th>
              <th className="centered">Rank</th>
              <th>Resume Summary</th>
              <th className="centered">Parsed Resume</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((row, index) => (
              <tr key={`row-${startIndex + index}`} className={row.status}>
                <td className="centered">{row.serialNumber}</td>
                <td className="text-cell">{row.fileName}</td>
                <td className="cell-with-loader">
                  {row.status === "completed" ? (
                    <span className="emphasis">{row.candidateId}</span>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
                <td className="cell-with-loader">
                  {row.status === "completed" ? (
                    <span
                      className={`candidate-name-link ${
                        isProcessing ? "disabled" : ""
                      }`}
                      onClick={() => handleCandidateClick(row)}
                    >
                      {row.candidateName}
                    </span>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
                <td className="centered cell-with-loader">
                  {row.status === "completed" ? (
                    <span className="badge score-badge">{row.matchScore}%</span>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
                <td className="centered cell-with-loader">
                  {row.status === "completed" ? (
                    <span className="emphasis">{row.rank}</span>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
                <td className="resume-summary-cell cell-with-loader">
                  {row.status === "completed" ? (
                    <div className="summary-text">{row.resumeSummary}</div>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
                <td className="centered cell-with-loader">
                  {row.status === "completed" && row.parsedResume ? (
                    <button
                      className="icon-button"
                      onClick={() => onViewParsedResume(row.parsedResume || "")}
                      title="View parsed resume"
                      disabled={isProcessing}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-state">
                  No resumes have been processed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
      {results.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={results.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}

      {isProcessing && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${
                ((results.length - processingCount) / results.length) * 100
              }%`,
            }}
          ></div>
        </div>
      )}

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={handleCloseModal}
          onViewParsedResume={onViewParsedResume}
        />
      )}
    </div>
  );
};

export default ResumeResultsTable;
