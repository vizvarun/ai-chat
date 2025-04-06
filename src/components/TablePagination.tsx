import React from "react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRowsPerPageChange(Number(e.target.value));
  };

  // Calculate the range of items currently displayed
  const startItem = Math.min(totalItems, (currentPage - 1) * rowsPerPage + 1);
  const endItem = Math.min(totalItems, currentPage * rowsPerPage);

  return (
    <div className="table-pagination">
      <div className="rows-per-page">
        <label htmlFor="rows-select">Rows per page:</label>
        <select
          id="rows-select"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="rows-select"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="pagination-info">
        {startItem}-{endItem} of {totalItems}
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          title="Previous page"
          aria-label="Previous page"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          title="Next page"
          aria-label="Next page"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
