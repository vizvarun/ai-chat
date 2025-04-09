import { useState } from "react";
import { ResumeResultRow } from "../types/resumeTypes";
import CandidateDetailModal from "./CandidateDetailModal";
import Loader from "./Loader";
import TablePagination from "./TablePagination";

interface ResumeResultsTableProps {
  results: ResumeResultRow[];
  isProcessing: boolean;
  isRanking?: boolean;
  onViewParsedResume: (resume: string) => void;
  onDismissError?: (index: number) => void;
  scoresReceived?: boolean;
}

const ResumeResultsTable: React.FC<ResumeResultsTableProps> = ({
  results,
  isProcessing,
  isRanking = false,
  onViewParsedResume,
  onDismissError,
  scoresReceived = false,
}) => {
  const [sortBy, setSortBy] = useState<"rank" | "name">("rank");
  const [selectedCandidate, setSelectedCandidate] =
    useState<ResumeResultRow | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sortedResults = [...results].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return -1;
    if (a.status !== "completed" && b.status === "completed") return 1;
    if (a.status === "completed" && b.status === "completed") {
      if (sortBy === "rank" && scoresReceived) {
        if (a.hasFinalRanking && b.hasFinalRanking) {
          // Only sort by rank if both have final ranking
          return (a.rank || 999) - (b.rank || 999);
        } else if (a.hasFinalRanking) {
          // Prioritize those with final ranking
          return -1;
        } else if (b.hasFinalRanking) {
          return 1;
        }
        // If neither has ranking, keep their original order
        return 0;
      } else {
        return (a.candidateName || "").localeCompare(b.candidateName || "");
      }
    }
    return 0;
  });

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

  // Helper to determine if a cell should show a loader
  const shouldShowLoader = (
    row: ResumeResultRow,
    field: "matchScore" | "rank"
  ) => {
    return (
      row.status === "completed" &&
      (!scoresReceived || !row.hasFinalRanking || row[field] === undefined)
    );
  };

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <div className="table-title">
          <p className="resume-table-title">
            Screened {results.length === 1 ? "Resume" : "Resumes"} (
            {results.length})
          </p>
        </div>
        <div className="table-actions">
          {isProcessing || isRanking ? (
            <div className="processing-pill">
              <span className="pulse-dot"></span>
              <span>
                {processingCount > 0 ? (
                  <>
                    Processing {processingCount}{" "}
                    {processingCount === 1 ? "resume" : "resumes"}
                  </>
                ) : isRanking ? (
                  <>Ranking resumes</>
                ) : (
                  <>Processing</>
                )}
              </span>
            </div>
          ) : (
            <div className="sort-controls">
              <span className="sort-label">Sort by:</span>
              <div className="sort-buttons">
                <button
                  className={`sort-button ${sortBy === "rank" ? "active" : ""}`}
                  onClick={() => handleSort("rank")}
                  title="Sort by rank"
                  disabled={!scoresReceived}
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
              <th className="centered">File Name</th>
              <th className="centered">Resume ID</th>
              <th className="centered">Candidate Name</th>
              <th className="centered">Match Score</th>
              <th className="centered">Rank</th>
              <th className="centered">Resume Summary</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((row, index) => (
              <tr key={`row-${startIndex + index}`} className={row.status}>
                <td className="centered">{row.serialNumber}</td>
                <td className="text-cell centered">{row.fileName}</td>
                <td className="cell-with-loader centered">
                  {row.status === "completed" ? (
                    <span className="emphasis">{row.candidateId}</span>
                  ) : row.status === "error" ? (
                    <div className="cell-error">
                      <span className="error-badge">Error</span>
                    </div>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
                <td className="cell-with-loader centered">
                  {row.status === "completed" ? (
                    <span
                      className={`candidate-name-link ${
                        isProcessing || isRanking ? "disabled" : ""
                      }`}
                      onClick={() => handleCandidateClick(row)}
                    >
                      {row.candidateName}
                    </span>
                  ) : row.status === "error" ? (
                    <div className="resume-error-message">
                      <span>{row.error || "Unknown error"}</span>
                      {onDismissError && (
                        <button
                          className="dismiss-error-btn"
                          onClick={() => onDismissError(row.serialNumber - 1)}
                          title="Dismiss error"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
                <td className="centered cell-with-loader">
                  {row.status === "completed" ? (
                    shouldShowLoader(row, "matchScore") ? (
                      <div className="cell-loader-container">
                        <Loader size="small" />
                      </div>
                    ) : (
                      <span
                        className={`badge score-badge ${
                          row.scoreCategory
                            ? row.scoreCategory.toLowerCase()
                            : ""
                        }`}
                      >
                        {row.matchScore}%
                      </span>
                    )
                  ) : row.status === "error" ? (
                    <span className="badge error-badge">Failed</span>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
                <td className="centered cell-with-loader">
                  {row.status === "completed" ? (
                    shouldShowLoader(row, "rank") ? (
                      <div className="cell-loader-container">
                        <Loader size="small" />
                      </div>
                    ) : (
                      <span
                        className={`badge ${
                          row.rank === 1 ? "top-rank-badge" : "score-badge"
                        }`}
                      >
                        {row.rank === 1 && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="trophy-icon"
                          >
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                            <path d="M4 22h16"></path>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                          </svg>
                        )}
                        {row.rank}
                      </span>
                    )
                  ) : row.status === "error" ? (
                    <span>-</span>
                  ) : (
                    <div className="cell-loader-container">
                      <Loader size="small" />
                    </div>
                  )}
                </td>
                <td className="resume-summary-cell cell-with-loader centered">
                  {row.status === "completed" ? (
                    <div className="summary-text">{row.resumeSummary}</div>
                  ) : row.status === "error" ? (
                    <span>-</span>
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

      {(isProcessing || isRanking) && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${
                isRanking
                  ? 60 + 40 * (Math.random() * 0.4 + 0.6)
                  : ((results.length - processingCount) / results.length) * 60
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
